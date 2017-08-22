Template.postModal.profileImage = function() {
	var user = Meteor.user(); 
	if (user) {
		return user.services.google.picture; 
	} 
};