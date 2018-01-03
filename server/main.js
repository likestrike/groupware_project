import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';


Meteor.startup(() => {
  // code to run on server at startup
});

// Keep track of how many administrators are online.
let count = 0;
const cursor = locmanNoti.find({ sent: false});
const handle = cursor.observeChanges({
  added(id, notification) {
    count += 1;

    var userId = notification.userId;
    var myTokenData = FcmTokens.findOne({'userId' : userId});
    console.log('add notification');
    console.log(userId);
     if(myTokenData){
     	console.log('myToken data : ' + myTokenData.token);
		var notiObj = {
		'title': notification.title,
		'body': notification.body,
		'icon': notification.icon,
		'click_action': notification.url
		};

		//  fetch 가 jsonRoutes에서 돌지 않으니 reactivevar를 이용해서 해보자. 
		fetch('https://fcm.googleapis.com/fcm/send', {
		'method': 'POST',
		'headers': {
		  'Authorization': 'key=' + Meteor.settings.public.config.apiKey,
		  'Content-Type': 'application/json'
		},
		'body': JSON.stringify({
		  'notification': notiObj,
		  'to': myTokenData.token
		})
		}).then(function(response) {
		console.log(response);
		}).catch(function(error) {
		console.error(error);
		})	
	}
  },
  removed() {
    count -= 1;
    console.log('change locmannoti');
  }
});
// After five seconds, stop keeping the count.
setTimeout(() => handle.stop(), 5000);


JsonRoutes.add("post", "/hellow/", function (req, res, next) {
  // var id = req.params.id;
  // console.log(req.query);
  var username = req.query.username;
  var recv = req.query.recv;
  var obj_id = req.query.obj_id;
  var projects_id = req.query.projects_id;

  var url = req.query.url+'?objid='+obj_id+'&recv='+recv+'&projects_id='+projects_id+'';
  var UserData = Meteor.users.findOne({'username':'essim'});

  if(UserData){  	
  	var userId = UserData._id;

	var notification = {
	'title': 'LOCUS LOCMAN Mesage',
	'body': 'LOCMAN에서 Note가 남겨졌어요.',
	'icon': '/images/favicon.png',
	'click_action': url,
	'userId' : userId
	};


	Meteor.call('locman_notiInsert', {notification}, function(error, result) {
      if (error)
        console.log(error);
    });

	// if(myTokenData){
	// 	var notification = {
	// 	'title': 'LOCUS LOCMAN Mesage',
	// 	'body': 'LOCMAN에서 Note가 남겨졌어요.',
	// 	'icon': '/images/favicon.png',
	// 	'click_action': url
	// 	};

	// 	//  fetch 가 jsonRoutes에서 돌지 않으니 reactivevar를 이용해서 해보자. 
	// 	fetch('https://fcm.googleapis.com/fcm/send', {
	// 	'method': 'POST',
	// 	'headers': {
	// 	  'Authorization': 'key=' + Meteor.settings.public.config.apiKey,
	// 	  'Content-Type': 'application/json'
	// 	},
	// 	'body': JSON.stringify({
	// 	  'notification': notification,
	// 	  'to': myTokenData.token
	// 	})
	// 	}).then(function(response) {
	// 	console.log(response);
	// 	}).catch(function(error) {
	// 	console.error(error);
	// 	})	
	// }
  }


  JsonRoutes.sendResult(res, {
    data: 'success'
  });


});

