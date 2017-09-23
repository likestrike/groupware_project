ownsDocument = function(userId, doc) {
	var loggedInUser = Meteor.user();
	if(loggedInUser){
		if (Roles.userIsInRole(loggedInUser, ['admin'], 'default-group')){
	  		return true;
		}
	}
  return doc && doc.userId === userId;
}