Accounts.ui.config({
  passwordSignupFields: 'USERNAME_ONLY' //  One of 'USERNAME_AND_EMAIL', 'USERNAME_AND_OPTIONAL_EMAIL', 'USERNAME_ONLY', or 'EMAIL_ONLY' (default).
});
// google login 의 계정을 locus.com 으로 제한 한다. config
Accounts.config({ restrictCreationByEmailDomain: 'locus.com' });


Template.login.onCreated(function () {
	this.autorun(function() {
		console.log('auto');
		// Whenever this session variable changes, run this function.
		var message = Session.get('displayMessage');
		if (message) {
  			// var stringArray = message.split('&amp;');
  			// ui.notify(stringArray[0], stringArray[1])
    	// 		.effect('slide')
    	// 		.closable();
    		console.log(message);
  			Session.set('displayMessage', null);
		}
	});
});
Template.login.events({
	'click #sign-google': function (e, t) {
		Meteor.loginWithGoogle({
		  requestPermissions: ['email']
		}, function(error) {
		  if (error) {
		    console.log(error); //If there is any error, will get error here
		    Session.set('displayMessage', err.reason);
		  }else{
		    FlowRouter.go('/');
		  }
		});
	},
	'submit form': function(event){
        event.preventDefault();
        var email = $('#email').val();
        var password = $('#password').val();

        Meteor.loginWithPassword(email, password, function(error){
		    if(error){
		        console.log(error.reason);
		    } else {
		        FlowRouter.go('/');
		    }
		});
    }
	'submit #login-form' : function(e, t){
      e.preventDefault();
      // retrieve the input field values
      var email = t.find('#login-email').value
        , password = t.find('#login-password').value;
        // Trim and validate your fields here....

        // If validation passes, supply the appropriate fields to the

        Meteor.loginWithPassword(email, password, function(err){
        if (err){
        	console.log(err.reason)
        	Session.set('displayMessage', err.reason);
        }else{
        	console.log('success');
        	FlowRouter.go('/');
        }
      });
         return false;
      }
});