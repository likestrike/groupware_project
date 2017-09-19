Template.postItem.helpers({
	writerthumb: function() {
	   return Meteor.users.find({profile: {_id: this.userId}});
	},
	writer: function() {
		return Meteor.users.find({'profile.fullname' : {_id: this.userId}});
	}

});