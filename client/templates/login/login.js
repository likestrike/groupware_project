

Template.login.onCreated(function () {
	this.autorun(function() {
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
		$('body').addClass('hold-transition').addClass('login-page');
	});

});

Template.login.events({
	'click #sign-google': function (e, t) {
		Meteor.loginWithGoogle({
		  requestPermissions: ['email']
		}, function(error) {
		  if (error) {
		  	console.log(error);
		    Bert.alert(error.reason, 'danger');
		    // Session.set('displayMessage', err.reason);
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
		        Bert.alert(error.reason, 'danger');
		    } else {
            $('body').removeClass('hold-transition').removeClass('login-page');
		        FlowRouter.go('/');
		    }
		});
  },
});