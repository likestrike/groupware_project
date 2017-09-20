Template.profile.helpers({
	test: function() {
	    var userId = FlowRouter.getParam('_id');
	    if ( userId !== undefined ) {
	      return Meteor.users.findOne({'_id': userId});
	    }
	  }
});
Template.profile.onCreated(function () {
	var userId = FlowRouter.getParam('_id');
	if ( userId !== undefined ) {
		Meteor.subscribe('userProfile', userId);
	}
});