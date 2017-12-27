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
          Bert.alert( '당신에게 메세지가 있어요~', 'success', 'growl-top-right', 'fa-info' );
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

