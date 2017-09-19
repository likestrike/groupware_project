Template.profile.helpers({
  users: function(){
     console.log(this.userinfo);
  },
});
Template.profile.onCreated(function () {
	var userId = FlowRouter.getParam( 'userId' );
	console.log(userId);
});