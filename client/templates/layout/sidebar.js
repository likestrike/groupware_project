Template.sidebar.helpers({
	username: function(){
		var user = Meteor.user();
		if (user) {
			return user.profile.fullname;
		}
	},
	profileURL: function() {
		var user = Meteor.user();
		if (user) {
			return user.profile.thumbnail;
		}
	}
});
  