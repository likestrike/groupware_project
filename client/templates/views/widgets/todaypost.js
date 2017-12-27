Template.todayPosts.helpers({
	recentPost : function(){
		Meteor.subscribe('posts');
		return Posts.find({},{sort: {submitted: -1}, skip: 0, limit: 1});
	}
});