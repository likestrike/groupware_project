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
	},
	'click #regist': function (e, t) {
		e.preventDefault();
        var email = $('#email').val();
        var password = $('#password').val();
        var username = $('#username').val();
        var fullname = $('#fullname').val();
        var options = {
        	email : email,
            username : username,
            fullname : fullname,
            password : password
        }
        Accounts.createUser(options, function(error){
			if (error){
				console.log(error.reason);
				return;
			}else{
				FlowRouter.go('/');
			}
        });
        
	}
});