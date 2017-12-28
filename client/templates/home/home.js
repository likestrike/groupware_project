
Template.home.helpers({
	getWidth:function(){
		return Session.get('window_width');
	},
	getHeight:function(){
		return Session.get('window_height');
	},
	postcount: function () {
		Meteor.subscribe('posts');
		return Posts.find().count();
	},
	usercount: function () {
		Meteor.subscribe('userAll');
		return Meteor.users.find().count();
	},
	blindcount: function () {
		Meteor.subscribe('blinds');
		return Blinds.find().count();
	},
	faqcount: function () {
		Meteor.subscribe('faqs');
		return Faqs.find().count();
	}
});

Template.home.onCreated(function(){
	console.log('created');

});