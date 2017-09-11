Template.signup.events({
	'click #sign-google': function (e, t) {
		Meteor.loginWithGoogle({
		  requestPermissions: ['email']
		}, function(error) {
		  if (error) {
		    console.log(error); //If there is any error, will get error here
		  }else{
		    FlowRouter.go('/');
		  }
		});
	}
});