
Accounts.ui.config({
  passwordSignupFields: 'USERNAME_AND_EMAIL' //  One of 'USERNAME_AND_EMAIL', 'USERNAME_AND_OPTIONAL_EMAIL', 'USERNAME_ONLY', or 'EMAIL_ONLY' (default).
});
// google login 의 계정을 locus.com 으로 제한 한다. config
Accounts.config({ restrictCreationByEmailDomain: 'locus.com' });



	Meteor.subscribe('fcmtoken');
	var configdata = Meteor.settings.public.config;
	var firebase = require("firebase");
	var token_str = '';

	firebase.initializeApp(configdata);
	const messaging = firebase.messaging();

	messaging.requestPermission()
	.then(function(){
		return messaging.getToken();
	})
	.then(function(token){
		token_str = token;
		
		// console.log('user Id : '+Meteor.user()._id);
		var userId = Meteor.userId();
		var token_cnt = FcmTokens.find({'userId': userId}).count();
		if(token_cnt == 0){
			Meteor.call('fcmInsert', {'token' : token_str}, function(error, result) {
		      if (error)
		        return Bert.alert(error.reason);
		    });
		}else{
			FcmTokens.update({'userId' : Meteor.userId()}, {$set: {'token' : token_str}}, function(error) {
		      if (error) {
		        // display the error to the user
		        return Bert.alert(error.reason);
		      }
		    });
		}
	})
	.catch(function(err){
		console.log('err');
	});


	// requestPermission();
	messaging.onMessage(function(payload){	
		console.log(payload);
	})

	

	// function requestPermission() {
	//     console.log('Requesting permission...');
	//     // [START request_permission]
	//     messaging.requestPermission()
	//     .then(function() {
	//       console.log('Notification permission granted.');
	//       // TODO(developer): Retrieve an Instance ID token for use with FCM.
	//       // [START_EXCLUDE]
	//       // In many cases once an app has been granted notification permission, it
	//       // should update its UI reflecting this.
	//       resetUI();
	//       // [END_EXCLUDE]
	//     })
	//     .catch(function(err) {
	//       console.log('Unable to get permission to notify.', err);
	//     });
	//     // [END request_permission]
	//   }
	//  function resetUI() {
 //    	showToken('loading...');
 //    	messaging.getToken()
	//     .then(function(currentToken) {
	//       if (currentToken) {
	//       	console.log('Toke : ' + currentToken);
	//       	token_str = currentToken;
	//         sendTokenToServer(currentToken);
	//         testNotification();
	//       } else {
	//         // Show permission request.
	//         console.log('No Instance ID token available. Request permission to generate one.');
	//         // Show permission UI.
	//         setTokenSentToServer(false);
	//       }
	//     })
	//     .catch(function(err) {
	//       console.log('An error occurred while retrieving token. ', err);
	//       showToken('Error retrieving Instance ID token. ', err);
	//       setTokenSentToServer(false);
	//     });
	//  }
	//  function sendTokenToServer(currentToken) {
	//     if (!isTokenSentToServer()) {
	//       console.log('Sending token to server...');
	//       // TODO(developer): Send the current token to your server.
	//       setTokenSentToServer(true);
	//     } else {
	//       console.log('Token already sent to server so won\'t send it again ' +
	//           'unless it changes');
	//     }

	//   }
	//   function isTokenSentToServer() {
	//     return window.localStorage.getItem('sentToServer') == 1;
	//   }
	//   function setTokenSentToServer(sent) {
	//     window.localStorage.setItem('sentToServer', sent ? 1 : 0);
	//   }
	//   function showToken(currentToken) {
	//     // Show token in console and UI.
	//     console.log(currentToken);
	//   }

	//   function testNotification(){
	//   	console.log('test notification');
	//   	var key = 'AIzaSyCRCiciBUAQ7nwHUoqe2X7B0X0UEN3cnQw';
	//   	console.log('to : ' + token_str);
	// 	var to = token_str;
	// 	var notification = {
	// 	  'title': 'Portugal vs. Denmark',
	// 	  'body': '5 to 1',
	// 	  'icon': 'firebase-logo.png',
	// 	  'click_action': 'http://localhost:3000'
	// 	};

	// 	fetch('https://fcm.googleapis.com/fcm/send', {
	// 	  'method': 'POST',
	// 	  'headers': {
	// 	    'Authorization': 'key=' + key,
	// 	    'Content-Type': 'application/json'
	// 	  },
	// 	  'body': JSON.stringify({
	// 	    'notification': notification,
	// 	    'to': to
	// 	  })
	// 	}).then(function(response) {
	// 	  console.log(response);
	// 	}).catch(function(error) {
	// 	  console.error(error);
	// 	})
	//   }
	  

