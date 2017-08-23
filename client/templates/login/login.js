// Accounts.ui.config({
//   passwordSignupFields: 'USERNAME_ONLY' //  One of 'USERNAME_AND_EMAIL', 'USERNAME_AND_OPTIONAL_EMAIL', 'USERNAME_ONLY', or 'EMAIL_ONLY' (default).
// });
// google login 의 계정을 locus.com 으로 제한 한다. config
Accounts.config({ restrictCreationByEmailDomain: 'locus.com' });


Template.login.events({
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