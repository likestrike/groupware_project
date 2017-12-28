importScripts('https://www.gstatic.com/firebasejs/3.9.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/3.9.0/firebase-messaging.js');

// var config = {
//     apiKey: "AIzaSyCv-92N06xp3uqA90V-jMEFWp6uazgNzg4",
//     authDomain: "meteor-project-177107.firebaseapp.com",
//     databaseURL: "https://meteor-project-177107.firebaseio.com",
//     projectId: "meteor-project-177107",
//     storageBucket: "meteor-project-177107.appspot.com",
//     messagingSenderId: "1000699696059"
// };

// firebase.initializeApp(config);
firebase.initializeApp({
  'messagingSenderId': '1000699696059'
});


const messaging = firebase.messaging();


messaging.setBackgroundMessageHandler(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  const notificationTitle = 'Background Message Title';
  const notificationOptions = {
    body: 'Background Message body.',
    icon: '/firebase-logo.png'
  };

  return self.registration.showNotification(notificationTitle,
      notificationOptions);
});

