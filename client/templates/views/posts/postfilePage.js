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
	},
    'click #move_prev' : function(e, t){
        var target = $(e.currentTarget).next();
    },
    'click #move_next' : function(e, t){
        var target = $(e.currentTarget).prev();
        var currentIndex = t.imgIndex.get();
        var currentX = t.transX.get();
        var imgs = target.find('img');

        if(currentIndex == (imgs.length - 1)){
            return;
        }
        var data_map = {};
        var index = 0;

        imgs.each(function(){
            data_map[index] = $(this).width();
            index++;
        });
        
        currentX = currentX + data_map[currentIndex];
        t.transX.set(currentX);

        currentIndex = currentIndex+1;
        t.imgIndex.set(currentIndex);

    },
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
// Session.set("resize", false);
Template.postfileView.onCreated( function() {
	this.count = 0;
    this.viewmode = 'horizontal';

    this.imgIndex = new ReactiveVar(0);
    this.transX = new ReactiveVar(0);
});
Template.postfileView.helpers({
	Images: function () {
		var ids = Template.instance().data;
		if(ids == undefined || ids.length == 0){
  			return false;
  		}
		return Collections.files.find({'_id' : {"$in": ids}, 'isImage' : true});
	},
	wrapperAttr : function(){
		Session.set("post_width", $('.post-grid:eq(0)').width());
        parent_width = Session.get('post_width');

		var child_width = parent_width - 20;
		var attribute = {};
		var ids = Template.instance().data;
        var count = 0;

        if(ids == undefined || ids.length == 0){
            count = 0;
        }else{
            count = Collections.files.find({'_id' : {"$in": ids}, 'isImage' : true}).count();    
        }
        // cout 에 현재 file Collections length를 저장. 
		Template.instance().count = count;

		if(count == 2){
			attribute.style = 'width : ' +child_width+'px; height : '+(child_width/2)+'px;';
		}else if(count == 3){
            attribute.style = 'width : ' +child_width+'px; height : '+child_width+'px;';
		}else if(count == 4){
            attribute.style = 'width : ' +child_width+'px; height : '+child_width+'px;';
        }else{
            // attribute.style = 'width : ' +child_width+'px; height : '+child_width+'px;';
        }
		return attribute;
	},
	incremented: function(index){
		index++;
    	return index;
	},
	atagAttr : function(index){
		var parent_width = Session.get('post_width');
        if(index == 0){
            // 초기화
            Template.instance().viewmode = 'horizontal';
        }
		index++;
		var attribute = {};
		var count = Template.instance().count;
        var imageWidth = (parent_width - 20) / 2;
        var childWidth = (parent_width - 20);
		if(count == 2){
			if(index == 1){
				attribute.style = 'width: '+imageWidth+'px;height: '+imageWidth+'px;position: absolute;left: 0;top: 0;';
			}else{
				attribute.style = 'width: '+imageWidth+'px;height: '+imageWidth+'px;position: absolute;right: 0;top: 0;';
			}
		}else if(count == 3){
            var viewmode = Template.instance().viewmode;
            // 첫 이미지가 세로, 가로인지에 따라 레이아웃 구성을 바꾼다. 
            if(index == 1){
                if(this.meta.width < this.meta.height){
                    // 세로 모드 변환
                    Template.instance().viewmode = 'vertical';
                    attribute.style = 'width: '+imageWidth+'px;height: '+(parent_width - 40)+'px;position: absolute;left: 0;top: 0;';
                }else{
                    // 가로 모드 
                    Template.instance().viewmode = 'horizontal';
                    attribute.style = 'width: '+childWidth+'px;height: '+imageWidth+'px;position: absolute;left: 0;top: 0;';
                }
            }else{
                if(viewmode == 'vertical'){
                    var other_height = (parent_width - 40)/2;
                    var top = index==3?other_height:0;
                    attribute.style = 'width: '+imageWidth+'px;height: '+other_height+'px;position: absolute;right: 0;top: '+top+'px;';   
                }else{
                    var top = imageWidth;
                    var left = index==3?imageWidth:0;
                    attribute.style = 'width: '+imageWidth+'px;height: '+(parent_width - 40)+'px;position: absolute;left: '+left+'px;top: '+top+'px;';
                }
            }
        }else if(count == 4){
            var viewmode = Template.instance().viewmode;
            var a,b,c,d;
            if(index == 1){
                if(this.meta.width < this.meta.height){
                    Template.instance().viewmode = 'vertical';
                    a = this.meta.height;
                    b = this.meta.width;
                    c = a - b;
                    d = Math.floor((c/a)*100);
                    var vWidth = (childWidth/3)*2;
                    var vHeight = (parent_width - 40);
                    attribute.style = 'width: '+vWidth+'px;height: '+vHeight+'px;position: absolute;left: 0;top: 0;';
                }else{
                    Template.instance().viewmode = 'horizontal';
                    a = this.meta.width;
                    b = this.meta.height;
                    c = a - b;
                    d = Math.floor((c/a)*100);
                    var vHeight = (childWidth/3)*2;
                    attribute.style = 'width: '+childWidth+'px;height: '+vHeight+'px;position: absolute;left: 0;top: 0;';
                }
                if(d < 10){
                    Template.instance().viewmode = 'grid';
                    attribute.style = 'width: '+imageWidth+'px;height: '+imageWidth+'px;position: absolute;left: 0;top: 0;';
                }
            }else{
                if(viewmode == 'vertical'){
                    var vWidth = (childWidth/3);
                    var vHeight = (parent_width - 40)/3;
                    var left = (childWidth/3)*2;
                    var top = vHeight * (index - 2);
                    attribute.style = 'width: '+vWidth+'px;height: '+vHeight+'px;position: absolute;left: '+left+'px;top: '+top+'px;';
                }else if(viewmode == 'horizontal'){
                    var vWidth = (childWidth/3);
                    var vHeight = (childWidth/3);
                    var left = vWidth * (index - 2); 
                    var top = (childWidth/3)*2;

                    attribute.style = 'width: '+vWidth+'px;height: '+vHeight+'px;position: absolute;left: '+left+'px;top: '+top+'px;';
                }else{
                    var top = 0;
                    var left = 0;
                    if(index == 2 || index == 4)left=imageWidth;
                    if(index == 3 || index == 4)top=imageWidth;
                    attribute.style = 'width: '+imageWidth+'px;height: '+imageWidth+'px;position: absolute;top: '+top+'px; left:'+left+'px;';   
                }
            }
        }
		return attribute;
	},
    divAttr : function(index){
        var parent_width = Session.get('post_width');
        index++;
        var attribute = {};
        var count = Template.instance().count;
        var childWidth = (parent_width - 20);
        var imageWidth = (parent_width - 20) / 2;
        if(count == 2){
            if(this.meta.width < this.meta.height){
                attribute.style = 'width : '+imageWidth+'px';
            }else{
                attribute.style = 'width : '+imageWidth+'px;height: '+imageWidth+'px;position: relative; overflow: hidden;border: 1px solid #e7eaec;';
            }
        }else if(count == 3){
            var viewmode = Template.instance().viewmode;
            if(viewmode == 'vertical'){
                if(index == 1){
                    attribute.style = 'width: '+imageWidth+'px;height: '+(parent_width - 40)+'px;position: relative;left: 0; overflow: hidden;border: 1px solid #e7eaec;';
                }else{
                    attribute.style = 'width: '+imageWidth+'px;height: '+((parent_width - 40)/2)+'px;position: relative;overflow: hidden;border: 1px solid #e7eaec;';    
                }
            }else{
                if(index == 1){
                    attribute.style = 'width: '+childWidth+'px;height: '+imageWidth+'px;position: relative;overflow: hidden;border: 1px solid #e7eaec;';
                }else{
                    attribute.style = 'width: '+imageWidth+'px;height: '+imageWidth+'px;position: relative;overflow: hidden;border: 1px solid #e7eaec;';
                }
            }
        }else if(count ==4){
            var viewmode = Template.instance().viewmode;
            if(viewmode == 'vertical'){
                if(index == 1){
                    var vWidth = (childWidth/3)*2;
                    var vHeight = (parent_width - 40);
                    attribute.style = 'width: '+vWidth+'px;height: '+vHeight+'px;position: relative; overflow: hidden;border: 1px solid #e7eaec;';
                }else{
                    var vWidth = (childWidth/3);
                    var vHeight = (parent_width - 40)/3;
                    attribute.style = 'width: '+vWidth+'px;height: '+vHeight+'px;position: relative;overflow: hidden;border: 1px solid #e7eaec;';
                }
            }else if(viewmode == 'horizontal'){
                if(index == 1){
                    var vHeight = (childWidth/3)*2;
                    attribute.style = 'width: '+childWidth+'px;height: '+vHeight+'px;position: relative;overflow: hidden;border: 1px solid #e7eaec;';
                }else{
                    var vWidth = (childWidth/3);
                    var vHeight = (childWidth/3);
                    attribute.style = 'width: '+vWidth+'px;height: '+vHeight+'px;position: relative;overflow: hidden;border: 1px solid #e7eaec;';
                }
            }else{
                attribute.style = 'width: '+imageWidth+'px;height: '+imageWidth+'px;position: relative;overflow: hidden;border: 1px solid #e7eaec;';
            }

        }

        return attribute;
    },
	imgAttr : function(index){
		var parent_width = Session.get('post_width');
		index++;
		var attribute = {};
		var count = Template.instance().count;
        var imgWidth = this.meta.width;
        var imgHeight = this.meta.height;
        var childWidth = (parent_width - 20);
        var imageWidth = (parent_width - 20) / 2;
        var viewmode = Template.instance().viewmode;
		if(count == 2){
			if(imgWidth < imgHeight){
                // 세로 이미지;
				attribute.style = 'width : '+imageWidth+'px';
			}else{
                // 가로 이미지
                if(imgWidth == imgHeight ){
                    attribute.style = 'width : '+imageWidth+'px';
                }else{
                    attribute.style = 'position: absolute;left: -'+(imageWidth/2)+'px; max-width : '+childWidth+'px; width : '+childWidth+'px;';    
                }
			}
		}else if(count == 3){
            
            if(viewmode == 'vertical'){
                if(index == 1){
                    childWidth = childWidth - 140;
                    attribute.style = 'position: absolute;left: -'+(childWidth/8)+'px; max-width : '+childWidth+'px; width : '+childWidth+'px;';    
                }else{
                    childWidth = childWidth - 40;
                    attribute.style = 'position: absolute;left: -'+(childWidth/4)+'px; max-width : '+childWidth+'px; width : '+childWidth+'px;';    
                }
            }else{
                if(index == 1){
                    attribute.style = 'position: absolute;left: 0; top: 0; max-width : '+childWidth+'px; width : '+childWidth+'px;';
                }else{
                    childWidth = childWidth - 40;
                    attribute.style = 'position: absolute;left: -'+(childWidth/4)+'px; max-width : '+childWidth+'px; width : '+childWidth+'px;';       
                }
            }
        }else if(count == 4){
            if(viewmode == 'vertical'){
                if(index == 1){
                    childWidth = childWidth - 140;
                    attribute.style = 'position: absolute;left: -6px; width : '+childWidth+'px;';
                }else{
                    var vWidth = (childWidth/3)*2;
                    var vHeight = (parent_width - 40)/3;
                    attribute.style = 'position: absolute;left: -'+(vWidth/5)+'px; height : '+vHeight+'px;';
                }
            }else if(viewmode == 'horizontal'){
                if(index == 1){
                    var vHeight = (childWidth/3)*2;
                    // attribute.style = 'width: '+childWidth+'px;height: '+vHeight+'px;position: relative;overflow: hidden;border: 1px solid #e7eaec;';
                    attribute.style = 'position: absolute;left: -'+(childWidth/8)+'px; height : '+vHeight+'px;';
                }else{
                    var vWidth = (childWidth/3);
                    var vHeight = (childWidth/3);
                    if(imgWidth < imgHeight){
                        attribute.style = 'position: absolute; width : '+vWidth+'px;';
                    }else{
                        attribute.style = 'position: absolute;left: -'+(childWidth/8)+'px; height : '+vHeight+'px;';
                    }
                }
            }else{
                var a,b,c,d;
                if(imgWidth < imgHeight){
                    a = this.meta.height;
                    b = this.meta.width;
                    c = a - b;
                    d = Math.floor((c/a)*100);
                    attribute.style = 'position: absolute;left: -'+(childWidth/8)+'px; width : '+imageWidth+'px;';
                }else{
                    a = this.meta.width;
                    b = this.meta.height;
                    c = a - b;
                    d = Math.floor((c/a)*100);
                    attribute.style = 'position: absolute;left: -'+(childWidth/6)+'px; height : '+imageWidth+'px;';
                }
                if(d < 10){
                    attribute.style = 'position: absolute; height : '+imageWidth+'px;';
                }

            }
        }

		return attribute;
	},
    imgAttrPlus : function(){
        var attribute = {};
        attribute.style = 'height : 310px;';
        return attribute; 
    },
    pannelAttr : function(){
        var attribute = {};
        var transX = Template.instance().transX.get();;

        attribute.style = 'transform: translateX(-'+transX+'px); transition-duration:500ms;';
        return attribute;
    },

});
