Template.profile.helpers({
	getWidth:function(){
		return Session.get('window_width');
	},
	getHeight:function(){
		return Session.get('window_height');
	},
	user: function() {
	    var userId = FlowRouter.getParam('_id');
	    console.log(userId);
	    if ( userId !== undefined ) {
	      return Meteor.users.findOne({'_id': userId});
	    }
	  }
});
Template.profile.onCreated(function () {
	// var userId = FlowRouter.getParam('_id');
	// if ( userId !== undefined ) {
	// 	Meteor.subscribe('userProfile', userId);
	// }
});