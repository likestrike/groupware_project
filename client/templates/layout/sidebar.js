Template.sidebar.helpers({
	username: function(){
		var user = Meteor.user();
		if (user) {
			return user.fullname;
		}
	},
	profileURL: function() {
		var user = Meteor.user();
		if (user) {
			return user.thumbnail;
		}
	}
});
