Template.profile.helpers({
	test: function() {
	    var imageId = FlowRouter.getParam('_id');
	    console.log(imageId);
	    if ( imageId !== undefined ) {
	      return Meteor.users.find({ _id: imageId });
	    }
	  }
});
Template.profile.onCreated(function () {
	 var imageId = FlowRouter.getParam('_id');
	if ( imageId !== undefined ) {
		Meteor.subscribe('userProfile', imageId);
	}
});