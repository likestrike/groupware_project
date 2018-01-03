import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';


Meteor.startup(() => {
  // code to run on server at startup
});


JsonRoutes.add("post", "/hellow/", function (req, res, next) {
  // var id = req.params.id;
  // console.log(req.query);
  var username = req.query.username;
  var recv = req.query.recv;
  var obj_id = req.query.obj_id;
  var projects_id = req.query.projects_id;

  var url = req.query.url+'?objid='+obj_id+'&recv='+recv+'&projects_id='+projects_id+'';
  var UserData = Meteor.users.findOne({'username':'essim'});

  console.log(UserData._id);

  if(UserData){
  	
  	var userId = UserData._id;
	console.log(userId);
	var myTokenData = FcmTokens.findOne({'userId' : userId});
	console.log(myTokenData);

	if(myTokenData){
		var notification = {
		'title': 'LOCUS LOCMAN Mesage',
		'body': 'LOCMAN에서 Note가 남겨졌어요.',
		'icon': '/images/favicon.png',
		'click_action': url
		};

		//  fetch 가 jsonRoutes에서 돌지 않으니 reactivevar를 이용해서 해보자. 
		fetch('https://fcm.googleapis.com/fcm/send', {
		'method': 'POST',
		'headers': {
		  'Authorization': 'key=' + Meteor.settings.public.config.apiKey,
		  'Content-Type': 'application/json'
		},
		'body': JSON.stringify({
		  'notification': notification,
		  'to': myTokenData.token
		})
		}).then(function(response) {
		console.log(response);
		}).catch(function(error) {
		console.error(error);
		})	
	}
  }

  JsonRoutes.sendResult(res, {
    data: 'success'
  });
});

