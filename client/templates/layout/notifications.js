Template.notifications.onCreated(function(){
  this.current_count = 0;
});
Template.notifications.helpers({
  notifications: function() {
    return Notifications.find({userId: Meteor.userId(), read: false});
  },
  notificationCount: function(){
    var countData = Notifications.find({userId: Meteor.userId(), read: false}).count();
    if(Template.instance().current_count != countData && countData > 0){
        if(Template.instance().current_count < countData){
          Meteor.subscribe('fcmtoken');
          var myTokenData = FcmTokens.findOne({'userId' : Meteor.userId()});
          Bert.alert( '당신에게 메세지가 있어요~', 'success', 'growl-top-right', 'fa-info' );

          console.log(myTokenData.token);
          var notification = {
            'title': 'LOCUS Groupware Mesage',
            'body': '메세지가 도착했습니다.',
            'icon': '/images/favicon.png',
            'click_action': 'http://likestrike.meteorapp.com/postlist'
          };
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
          Template.instance().current_count = countData;  
        }
    }
    
    
    return Notifications.find({userId: Meteor.userId(), read: false}).count();
  },
});

Template.notificationItem.helpers({
  notificationPostPath: function() {
    return ;
    // return Router.routes.postPage.path({_id: this.postId});
  },
  writer: function() {
    Meteor.subscribe('user');
    return Meteor.users.findOne(this.commenterId);
  },
  formattedDate: function(){
    moment.locale('ko');
    return moment(this.submitted).from(moment(new Date() ));
  },
});

Template.notificationItem.events({
  'click a': function() {
    Notifications.update(this._id, {$set: {read: true}});
  }
});

