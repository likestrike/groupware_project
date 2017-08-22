Template.sidebar.helpers({
	username: function(){
		var user = Meteor.user(); 
		if (user) {
			return user.services.google.name;    
		} 
	},
	profileURL: function() {
		var user = Meteor.user(); 
		if (user) {
			return user.services.google.picture; 
		} 
	}
});
