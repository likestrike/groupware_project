Template.google_api.onCreated(function () {

});
var apidata;
Template.google_api.events({
  'click #api_start': function (e, t) {
    callGoogle();
  },
  'click #btn_save': function (e, t) {
    e.preventDefault();

    // make users data
    for (var i = 0; i < apidata.length; i++) {
      console.log(apidata[i].organizations);
      var user = {
        services : {
          google : {
            id : apidata[i].id,
            email : apidata[i].primaryEmail,
            name : apidata[i].name.fullName,
            given_name : apidata[i].name.givenName,
            family_name : apidata[i].name.familyName,
            picture : apidata[i].thumbnailPhotoUrl===undefined?'/images/user_empty.png':apidata[i].thumbnailPhotoUrl
          }
        },
        orgPath : apidata[i].orgUnitPath, // 조직도 경로
        department : apidata[i].organizations==undefined?'unknown':apidata[i].organizations[0].department,
        phones : apidata[i].phones,
        username : apidata[i].primaryEmail
      };

      Meteor.call('addUsers', user, function(error, result) {
        if (error)
          return alert(error.reason);
      });

    }
  }
});
function callGoogle() {
    jQuery.ajax({
        url: 'https://apis.google.com/js/api.js?onload=handleClientLoad',
        dataType: 'script',
        success: function () {
            console.log("google api Success");
            handleClientLoad();
        },
        error: function (e) {
            console.log("Error")
        },
        async: true
    });

    return false;
}

// Client ID and API key from the Developer Console
var CLIENT_ID = '1000699696059-bta1aomjalap2249j68g0ct9f8mo32tj.apps.googleusercontent.com';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/admin/directory_v1/rest"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = 'https://www.googleapis.com/auth/admin.directory.user.readonly';

var authorizeButton = document.getElementById('authorize-button');
var signoutButton = document.getElementById('signout-button');


//This function is not executing
function handleClientLoad() {
    console.log("handleClientLoad");

    gapi.load('client:auth2', initClient);
}

function initClient() {
gapi.client.init({
  discoveryDocs: DISCOVERY_DOCS,
  clientId: CLIENT_ID,
  scope: SCOPES
}).then(function () {
  // Listen for sign-in state changes.
  gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

  // Handle the initial sign-in state.
  updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
});
}

function appendPre(message) {
        var pre = document.getElementById('content');
        var textContent = document.createTextNode(message + '\n');
        pre.appendChild(textContent);
}
function updateSigninStatus(isSignedIn) {
	if (isSignedIn) {
    apidata = null;
    $('#content').empty();
		listUsers();
	}
}
function listUsers() {
	gapi.client.directory.users.list({
		'customer': 'my_customer',
		'maxResults': 500,
		'orderBy': 'email'
	}).then(function(response) {
	var users = response.result.users;

  apidata = users;
	appendPre('Users:');

	if (users && users.length > 0) {
		for (i = 0; i < users.length; i++) {
			var user = users[i];
			console.log(user);
			appendPre('-' + i + ' ' + user.primaryEmail + ' (' + user.name.fullName + ')');
      $('#btn_save').removeClass('disabled');
		}
	} else {
		appendPre('No users found.');
	}
});
}