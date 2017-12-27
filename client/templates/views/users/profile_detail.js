Template.profileDetail.helpers({
	ownUserInfo: function(){
		var loggedInUser = Meteor.user();
		if(loggedInUser){
			if (Roles.userIsInRole(loggedInUser, ['admin'], 'default-group')){
		  		return true;
			}
		}
		return this._id === Meteor.userId();
	},
	recentPost : function(){
		Meteor.subscribe('posts')
		return Posts.find({userId : this._id}, {sort: {submitted: -1}, skip: 0, limit: 3});
	}
});