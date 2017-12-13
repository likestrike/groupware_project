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
	}
});
Meteor.startup(function () {
	Session.set("window_width", $(window).width());
	Session.set("window_height", $(window).height());
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
  });
});
Template.postlist.onCreated(function(){
	var self = this;
	$(window).on('scroll', function(){
		if($('html, body')[0].scrollHeight - $('html, body').scrollTop() === $('html, body')[0].clientHeight){
			var postcount = Posts.find().count();
			var current = Session.get("inc_limit");
			if(postcount > current){
				Session.set("inc_limit", current+12);
			}
		}
	});
	// $(window).resize(function() {
	// 	if($(this).width() >= 990 && $(this).width() <= 1420){
	// 		console.log('ddd');
	// 		Session.set("resize", new Date());
	// 	}else if($(this).width() > 1420){
	// 		console.log('ccc');
	// 	}else if($(this).width() < 991){
	// 		console.log('aaa');
	// 	}
	// });
})
