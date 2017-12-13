import { Blaze } from 'meteor/blaze';
Session.set("resize", false);
Session.set("col_count", false);
Session.set("window_width", null);
Session.set("inc_limit", 12);

Template.blindlist.helpers({
	getWidth:function(){
		return Session.get('window_width');
	},
	blindData: function() {
		var blinds = [];
		var _i = 0;
		var _limit = Session.get("inc_limit");

		Blinds.find({}, {sort: {submitted: -1}, skip: 0, limit: _limit}).forEach(function(p) {
	  		p.index = _i;
	  		_i++;
	  		blinds.push(p);
		});
		return blinds;
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

Template.blindlist.events({
	'click #blind-modal': function (e, t) {
		e.preventDefault()
		Modal.show('blindModal');
	}
});

Meteor.startup(function () {
	Session.set("window_width", $(window).width());
  window.addEventListener('resize', function(){
  	if($(this).width() >= 990 && $(this).width() <= 1420){
  		Session.set("resize", true);
  		Session.set("window_width", $(this).width());
  	}else{
  		Session.set("resize", false);
  		Session.set("window_width", $(this).width());
  	}
  });
});
Template.blindlist.onCreated(function(){
	var self = this;
	$(window).on('scroll', function(){
		if($('html, body')[0].scrollHeight - $('html, body').scrollTop() === $('html, body')[0].clientHeight){
			var blindcount = Blinds.find().count();
			var current = Session.get("inc_limit");
			if(blindcount > current){
				Session.set("inc_limit", current+12);
			}
		}
	});
})