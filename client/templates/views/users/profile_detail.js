Template.profileDetail.helpers({
	ownUserInfo: function(){
		var loggedInUser = Meteor.user();
		if(loggedInUser){
			if (Roles.userIsInRole(loggedInUser, ['admin'], 'default-group')){
		  		return true;
			}
		}
		return this._id === Meteor.userId();
	}
});