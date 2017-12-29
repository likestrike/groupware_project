import { ClientStorage }     from 'meteor/ostrio:cstorage';
var firebase = require("firebase");
var token_str = '';
var configdata = Meteor.settings.public.config;

Template.controles.onCreated(function () {
	var self = this;
	self.isReady = new ReactiveVar(false);
	self.token = '';

	this.autorun(function () {
	    if (self.isReady.get()) {
	    	console.log('ready');
	    	console.log(token_str);
	    }
	});
});
Template.controles.events({
	'click #requeset-push': function (e, t) {
		requestPermission();

		console.log(token_str);

		// const handle = Meteor.subscribe('fcmtoken');
		// Tracker.autorun(() => {
		//   const isReady = handle.ready();
		//   console.log(`Handle is ${isReady ? 'ready' : 'not ready'}`);  
		//   console.log(token_str)
		//   if(isReady){
		//   		var userId = Meteor.userId();
		// 		var userToken = FcmTokens.findOne({'userId': userId});
		// 		console.log(userToken);
		// 		if(typeof(userToken) !== 'undefined'){
		// 			if(token_str !== ''){
		// 				FcmTokens.update(userToken._id, {$set: {'token' : token_str}}, function(error) {
		// 			      if (error) {
		// 			        // display the error to the user
		// 			        return Bert.alert(error.reason);
		// 			      }
		// 			    });
		// 			}
		// 		}else{
		// 			console.log('insert token');
		// 			Meteor.call('fcmInsert', {'token' : token_str}, function(error, result) {
		// 		      if (error)
		// 		        return Bert.alert(error.reason);
		// 		    });
		// 		}
		// 	}
		// });
	}
});


firebase.initializeApp(configdata);
const messaging = firebase.messaging();

function requestPermission() {
	    console.log('Requesting permission...');
	    // [START request_permission]
	    messaging.requestPermission()
	    .then(function() {
	      console.log('Notification permission granted.');
	      // TODO(developer): Retrieve an Instance ID token for use with FCM.
	      // [START_EXCLUDE]
	      // In many cases once an app has been granted notification permission, it
	      // should update its UI reflecting this.
	      resetUI();
	      // [END_EXCLUDE]
	    })
	    .catch(function(err) {
	      console.log('Unable to get permission to notify.', err);
	    });
	    // [END request_permission]
	  }
	 function resetUI() {
    	showToken('loading...');
    	messaging.getToken()
	    .then(function(currentToken) {
	      if (currentToken) {
	      	console.log('Toke : ' + currentToken);
	      	Template.instance().isReady.set(true);
	      	token_str = currentToken;
	        sendTokenToServer(currentToken);
	      } else {
	        // Show permission request.
	        console.log('No Instance ID token available. Request permission to generate one.');
	        // Show permission UI.
	        setTokenSentToServer(false);
	      }
	    })
	    .catch(function(err) {
	      console.log('An error occurred while retrieving token. ', err);
	      showToken('Error retrieving Instance ID token. ', err);
	      setTokenSentToServer(false);
	    });
	 }
	 function sendTokenToServer(currentToken) {
	    if (!isTokenSentToServer()) {
	      console.log('Sending token to server...');
	      // TODO(developer): Send the current token to your server.
	      setTokenSentToServer(true);
	    } else {
	      console.log('Token already sent to server so won\'t send it again ' +
	          'unless it changes');
	    }

	  }
	  function isTokenSentToServer() {
	    return window.localStorage.getItem('sentToServer') == 1;
	  }
	  function setTokenSentToServer(sent) {
	    window.localStorage.setItem('sentToServer', sent ? 1 : 0);
	  }
	  function showToken(currentToken) {
	    // Show token in console and UI.
	    console.log(currentToken);
	  }
