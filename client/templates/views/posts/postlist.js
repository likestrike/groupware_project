import { Blaze } from 'meteor/blaze';
Session.set("resize", false);
Session.set("col_count", false);
Session.set("window_width", null);
Session.set("inc_limit", 12);

Template.postlist.helpers({
	getWidth:function(){
		return Session.get('window_width');
	},
	getHeight:function(){
		return Session.get('window_height');
	},
	postData: function() {
		var posts = [];
		var _i = 0;
		var _limit = Session.get("inc_limit");
		var test = Posts.find();

		Posts.find({}, {sort: {submitted: -1}, skip: 0, limit: _limit}).forEach(function(p) {
	  		p.index = _i;
	  		_i++;
	  		posts.push(p);
		});
		return posts;
	},
	odd: function() {
		return !(this.index % 2 === 0);
	},
	even: function() {
		return (this.index % 2 === 0);
	},
	col1 : function(){
		return (this.index % 3 === 0);
	},
	col2 : function(){
		return (this.index % 3 === 1);
	},
	col3 : function(){
		return (this.index % 3 === 2);
	},
	condition1:function(){
		if(Session.get('window_width') > 1420){
			return true;
		}
		return false;
	},
	condition2:function(){
		if(Session.get('window_width') >= 990 && Session.get('window_width') <= 1420){
			return true;
		}
		return false;
	},
	condition3:function(){
		if(Session.get('window_width') < 991){
			return true;
		}
		return false;
	}
});
Template.postlist.events({
	'click #post-modal': function (e, t) {
		e.preventDefault()
		Modal.show('postModal');
	},
	'click #small-pencil':function(e, t){
		e.preventDefault()
		Modal.show('postModal');
	},
	'click .box-widget' : function(e, t){
		// $box = $(e.currentTarget).find('.post-wrapper');
		// $child = $box.find('.post-context-div');
		// if(!$child.hasClass('minimum')){
		// 	$child.addClass('minimum');
		// }else{
		// 	$child.removeClass('minimum')
		// 	$box.addClass('trans')
		// 	minimumHeight = 180;

	 //        // get current height
	 //        currentHeight = $box.innerHeight();

	 //        // get height with auto applied
	 //        autoHeight = $box.find('.post-context').css('height', 'auto').innerHeight();

	 //        // reset height and revert to original if current and auto are equal
	 //        $box.css('height', currentHeight).animate({
	 //            'height': (currentHeight == autoHeight ? minimumHeight : autoHeight)
	 //        })
		// }
	}
});

Template.postlist.onCreated(function(){
	var self = this;

	window.addEventListener('resize', function(){
	  	if($(this).width() >= 990 && $(this).width() <= 1420){
	  		Session.set("resize", true);
	  		Session.set("window_width", $(this).width());
	  		Session.set("window_height", $(this).height());
	  	}else{
	  		Session.set("resize", false);
	  		Session.set("window_width", $(this).width());
	  		Session.set("window_height", $(this).height());
	  	}
	  	Session.set("post_width", $('.post-grid:eq(0)').width());
	  });
	$(window).on('scroll', function(){
		if($('html, body')[0].scrollHeight - $('html, body').scrollTop() === $('html, body')[0].clientHeight){
			console.log('ddd');
			var postcount = Posts.find().count();
			var current = Session.get("inc_limit");
			if(postcount > current){
				Session.set("inc_limit", current+12);
			}
		}
	});

	// $('section.post-content').addClass('animated fadeInUp m-t-xs');

})
