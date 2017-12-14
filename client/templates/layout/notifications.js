Template.notifications.helpers({
  notifications: function() {
    return Notifications.find({userId: Meteor.userId(), read: false});
  },
  notificationCount: function(){
    return Notifications.find({userId: Meteor.userId(), read: false}).count();
  },
});

Template.notificationItem.helpers({
  notificationPostPath: function() {
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