Template.commentItem.helpers({
	writer: function() {
		Meteor.subscribe('user');
		// return Meteor.users.find({'profile' : {_id: this.userId}});
		return Meteor.users.findOne(this.userId);
	},
	formattedDate: function(){
		return moment(this.submitted).format("dddd, MMMM Do YYYY, h:mm:ss");
	}
	
});