import { _app, Collections } from '/lib/core.js';

Template.postfilePage.onCreated(function(){
  this.showPreview  = () => {
    if (this.data.isImage && /png|jpe?g/i.test(this.data.extension)) {
      if (this.data.versions.thumbnail40) {
        return true;
      }
    }
    return false;
  };
});
Template.postfilePage.helpers({
	showPreview: function () {
		return Template.instance().showPreview();
	},
});
Template.postfilePageSingle.onCreated(function(){
  this.showPreview  = () => {
    if (this.data.isImage && /png|jpe?g/i.test(this.data.extension)) {
      if (this.data.versions.thumbnail40) {
        return true;
      }
    }
    return false;
  };
});
Template.postfilePageSingle.helpers({
	showPreview: function () {
		return Template.instance().showPreview();
	},
	setAttr : function(){
		var attr = {};
		if(this.meta.width < this.meta.height){
			attr.style = 'padding-top : 134%;';
		}else{
			attr.style = 'padding-top : 64%;';
		}
		return attr;
	}
});
Template.postfilePageSingle.events({
    "click img.postfile-image": function(e) {
        var gallery = new PhotoSwipe($('.pswp')[0], PhotoSwipeUI_Default, [
            {
                src: e.target.dataset.src, // assumes the high-res source is in data-src attribute of the image element
                msrc: e.target.src,
                w: e.target.dataset.width, // PhotoSwipe requires you to know the dimensions
                h: e.target.dataset.height // More information: http://photoswipe.com/documentation/faq.html
            }
        ], {
            index: 0,
            getThumbBoundsFn: function(index) {
                // See Options -> getThumbBoundsFn section of documentation for more info
                var thumbnail = e.target,
                    pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
                    rect = thumbnail.getBoundingClientRect();
                return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
            },
            barsSize: {top:0,bottom:0},
            captionEl: false,
            fullscreenEl: false,
            shareEl: false,
            tapToClose: true,
            tapToToggleControls: false
        });
        gallery.init();
    }
});
Template.postfileView.events({
	'click a.image-swipe': function (e) {
		onThumbnailsClick(e);
	}
});
function onThumbnailsClick(e){
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
function closest(el, fn) {
	return el && ( fn(el) ? el : closest(el.parentNode, fn) );
}

function openPhotoSwipe(index, galleryElement, disableAnimation, fromURL) {
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
function parseThumbnailElements(el){
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
Template.postfileView.onCreated( function() {

});
Template.postfileView.helpers({
	Images: function () {
		var ids = Template.instance().data;
		if(ids == undefined || ids.length == 0){
  			return false;
  		}
		return Collections.files.find({'_id' : {"$in": ids}, 'isImage' : true});
	},

});