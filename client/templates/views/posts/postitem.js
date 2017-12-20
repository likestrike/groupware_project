import { _app, Collections } from '/lib/core.js';
import { Template }          from 'meteor/templating';
import { Blaze } from 'meteor/blaze';

Template.postItem.helpers({
	writer: function() {
		Meteor.subscribe('user');
		// return Meteor.users.find({'profile' : {_id: this.userId}});
		return Meteor.users.findOne(this.userId);
	},
	formattedDate: function(){
		moment.locale('ko');
		return moment(this.submitted).format("LLL");
	},
	comments: function() {
		Meteor.subscribe('comments', this._id);
	    // return Comments.find({postId: this._id}, {sort: {submitted: -1}, limit: 2});
	    return Comments.find({postId: this._id});
	},
	ownPost: function(){
		var loggedInUser = Meteor.user();
		if(loggedInUser){
			if (Roles.userIsInRole(loggedInUser, ['admin'], 'default-group')){
		  		return true;
			}
		}
		return this.userId === Meteor.userId();
	},
	checkPostLiked : function(){
		var postItem = Posts.find( { _id: this._id}, { likers: 1}).fetch();
		if(postItem.length > 0){
			var res = postItem[0].likers;
			var q = _.find(res, (x) => x == Meteor.userId());

			if ( q == Meteor.userId() ){
				return "press";
			}
		}
  	},
  	getFiledata : function(){
  		if(this.fileIds == undefined || this.fileIds.length == 0){
  			return false;
  		}
  		return Collections.files.find({'_id' : {"$in": this.fileIds}});
  	},
  	isSingle : function(){
  		if(this.fileIds == undefined || this.fileIds.length == 0){
  			return false;
  		}
  		var count = Collections.files.find({'_id' : {"$in": this.fileIds}}).count();
  		if(count == 1)return true;
  		return false;
  	},
  	testgo: function(){
  		if(this.fileIds == undefined || this.fileIds.length == 0){
  			return false;
  		}
  		Blaze.renderWithData(Template.postfileView, {fileIds: this.fileIds});
  	},
  	getdata: function(){
  		return this.fileIds;
  	}
});

Template.postItem.events({
	'click #comment_submit': function (e, t) {
		e.preventDefault();

		var $body = $(e.currentTarget).parents('form').find('#comment');
		console.log($body);
	    var comment = {
	      body: $body.html(),
	      postId: this._id
	    };

	    Meteor.call('commentInsert', comment, function(error, commentId) {
	      if (error){
	        throwError(error.reason);
	      } else {
	        $body.empty();
	      }
	    });
	},
	'click #edit_post':function(e, t){
		e.preventDefault()
		var itemId = this._id;
		console.log(itemId);
		Modal.show('postEditModal', function () {
			return Posts.findOne(itemId);
		});
		// Modal.show('postEditModal');
	},
	'click #delete_post':function(e, t){
		e.preventDefault()
		var currentPostId = this._id;
		var myalert = new MyAlert();
		var callback = {
			fn: function() {
				Posts.remove(currentPostId);
				FlowRouter.go('/postlist');
			}
		}
		myalert.deleteConfirm(callback);
	},
	'click #postLike':function(e, t){
		e.preventDefault();
		var currentPostId = this._id;
	},

	'click .custom-like':function(e, t){
		var postId = this._id;
		// $(e.target).toggleClass("press");
		 $(e.target).toggleClass( "press", 1000 );
		Meteor.call('postLiked', postId, function(error, postId) {
	      if (error){
	        throwError(error.reason);
	      } else {
	        console.log('like success');
	      }
	    });
		// $(".custom-like, .custom-like-span").toggleClass( "press", 1000 );
	},
	'click #commentUpload'(e, template) {
		if (!_app.isiOS) {
		  e.preventDefault();
		}
		template.$('#commentfile').trigger('click');
		if (!_app.isiOS) {
		  return false;
		}
	},
	'change #commentfile'(e, template) {
		template.$('form#commentform').submit();
	},
	'submit form#commentform'(e, template) {
		e.preventDefault();
		// template.error.set(false);
		template.initiateUpload(e, e.currentTarget.commentfile.files);
		return false;
	},

});

Template.postItem.onCreated(function(){
	var self = this;
	$('.post-context-div').addClass('minimum');

	this.initiateUpload = (event, file) => {
		console.log(file);
	};


});
function fn_photoSwipe(isLoaded){
	var initPhotoSwipeFromDOM = function(gallerySelector) {
			console.log('dd');
			console.log(Template.isPhoto);
			isLoaded.set(true);

			var parseThumbnailElements = function(el) {
			    var thumbElements = el.childNodes,
			        numNodes = thumbElements.length,
			        items = [],
			        el,
			        childElements,
			        thumbnailEl,
			        size,
			        item;

			    for(var i = 0; i < numNodes; i++) {
			        el = thumbElements[i];

			        // include only element nodes
			        if(el.nodeType !== 1) {
			          continue;
			        }

			        childElements = el.children;

			        size = el.getAttribute('data-size').split('x');

			        // create slide object
			        item = {
						src: el.getAttribute('href'),
						w: parseInt(size[0], 10),
						h: parseInt(size[1], 10),
						author: el.getAttribute('data-author')
			        };

			        item.el = el; // save link to element for getThumbBoundsFn

			        if(childElements.length > 0) {
			          item.msrc = childElements[0].getAttribute('src'); // thumbnail url
			          if(childElements.length > 1) {
			              item.title = childElements[1].innerHTML; // caption (contents of figure)
			          }
			        }


					var mediumSrc = el.getAttribute('data-med');
		          	if(mediumSrc) {
		            	size = el.getAttribute('data-med-size').split('x');
		            	// "medium-sized" image
		            	item.m = {
		              		src: mediumSrc,
		              		w: parseInt(size[0], 10),
		              		h: parseInt(size[1], 10)
		            	};
		          	}
		          	// original image
		          	item.o = {
		          		src: item.src,
		          		w: item.w,
		          		h: item.h
		          	};

			        items.push(item);
			    }

			    return items;
			};

			// find nearest parent element
			var closest = function closest(el, fn) {
			    return el && ( fn(el) ? el : closest(el.parentNode, fn) );
			};

			var onThumbnailsClick = function(e) {
			    e = e || window.event;
			    e.preventDefault ? e.preventDefault() : e.returnValue = false;

			    var eTarget = e.target || e.srcElement;

			    var clickedListItem = closest(eTarget, function(el) {
			        return el.tagName === 'A';
			    });

			    if(!clickedListItem) {
			        return;
			    }

			    var clickedGallery = clickedListItem.parentNode;

			    var childNodes = clickedListItem.parentNode.childNodes,
			        numChildNodes = childNodes.length,
			        nodeIndex = 0,
			        index;

			    for (var i = 0; i < numChildNodes; i++) {
			        if(childNodes[i].nodeType !== 1) {
			            continue;
			        }

			        if(childNodes[i] === clickedListItem) {
			            index = nodeIndex;
			            break;
			        }
			        nodeIndex++;
			    }

			    if(index >= 0) {
			        openPhotoSwipe( index, clickedGallery );
			    }
			    return false;
			};

			var photoswipeParseHash = function() {
				var hash = window.location.hash.substring(1),
			    params = {};

			    if(hash.length < 5) { // pid=1
			        return params;
			    }

			    var vars = hash.split('&');
			    for (var i = 0; i < vars.length; i++) {
			        if(!vars[i]) {
			            continue;
			        }
			        var pair = vars[i].split('=');
			        if(pair.length < 2) {
			            continue;
			        }
			        params[pair[0]] = pair[1];
			    }

			    if(params.gid) {
			    	params.gid = parseInt(params.gid, 10);
			    }

			    return params;
			};

			var openPhotoSwipe = function(index, galleryElement, disableAnimation, fromURL) {
			    var pswpElement = document.querySelectorAll('.pswp')[0],
			        gallery,
			        options,
			        items;

				items = parseThumbnailElements(galleryElement);

			    // define options (if needed)
			    options = {

			        galleryUID: galleryElement.getAttribute('data-pswp-uid'),

			        getThumbBoundsFn: function(index) {
			            // See Options->getThumbBoundsFn section of docs for more info
			            var thumbnail = items[index].el.children[0],
			                pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
			                rect = thumbnail.getBoundingClientRect();

			            return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
			        },

			        addCaptionHTMLFn: function(item, captionEl, isFake) {
						if(!item.title) {
							captionEl.children[0].innerText = '';
							return false;
						}
						captionEl.children[0].innerHTML = item.title +  '<br/><small>Photo: ' + item.author + '</small>';
						return true;
			        },

			    };


			    if(fromURL) {
			    	if(options.galleryPIDs) {
			    		// parse real index when custom PIDs are used
			    		// http://photoswipe.com/documentation/faq.html#custom-pid-in-url
			    		for(var j = 0; j < items.length; j++) {
			    			if(items[j].pid == index) {
			    				options.index = j;
			    				break;
			    			}
			    		}
				    } else {
				    	options.index = parseInt(index, 10) - 1;
				    }
			    } else {
			    	options.index = parseInt(index, 10);
			    }

			    // exit if index not found
			    if( isNaN(options.index) ) {
			    	return;
			    }
			    options.shareButtons = [
				    {id:'download', label:'Download image', url:'{{raw_image_url}}', download:true}
				];
			    if(disableAnimation) {
			        options.showAnimationDuration = 0;
			    }

			    // Pass data to PhotoSwipe and initialize it
			    gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);

			    // see: http://photoswipe.com/documentation/responsive-images.html
				var realViewportWidth,
				    useLargeImages = false,
				    firstResize = true,
				    imageSrcWillChange;

				gallery.listen('beforeResize', function() {

					var dpiRatio = window.devicePixelRatio ? window.devicePixelRatio : 1;
					dpiRatio = Math.min(dpiRatio, 2.5);
				    realViewportWidth = gallery.viewportSize.x * dpiRatio;


				    if(realViewportWidth >= 1200 || (!gallery.likelyTouchDevice && realViewportWidth > 800) || screen.width > 1200 ) {
				    	if(!useLargeImages) {
				    		useLargeImages = true;
				        	imageSrcWillChange = true;
				    	}

				    } else {
				    	if(useLargeImages) {
				    		useLargeImages = false;
				        	imageSrcWillChange = true;
				    	}
				    }

				    if(imageSrcWillChange && !firstResize) {
				        gallery.invalidateCurrItems();
				    }

				    if(firstResize) {
				        firstResize = false;
				    }

				    imageSrcWillChange = false;

				});

				gallery.listen('gettingData', function(index, item) {
				    if( useLargeImages ) {
				        item.src = item.o.src;
				        item.w = item.o.w;
				        item.h = item.o.h;
				    } else {
				        item.src = item.m.src;
				        item.w = item.m.w;
				        item.h = item.m.h;
				    }
				});

			    gallery.init();
			};

			// select all gallery elements
			var galleryElements = document.querySelectorAll( gallerySelector );
			for(var i = 0, l = galleryElements.length; i < l; i++) {
				galleryElements[i].setAttribute('data-pswp-uid', i+1);
				galleryElements[i].onclick = onThumbnailsClick;
			}

			// Parse URL and open gallery if it contains #&pid=3&gid=1
			var hashData = photoswipeParseHash();
			if(hashData.pid && hashData.gid) {
				openPhotoSwipe( hashData.pid,  galleryElements[ hashData.gid - 1 ], true, true );
			}
		};
		initPhotoSwipeFromDOM('.post-images');
		return {
			ready: function () {
		      return isLoaded.get();
		    }
		};
}




