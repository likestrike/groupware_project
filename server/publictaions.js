
// Meteor.publish("user", function () {
// 	return Meteor.users.find();
// });
Meteor.publish('user', function () {
  return Meteor.users.find({}, {fields: {'profile': 1}});
});
Meteor.publish('userProfile', function (param) {
  check(param, Object);
  return Meteor.users.find({_id : param._id}, {fields: {profile: 1}});
});
Meteor.publish('posts', function() {
  return Posts.find();
});
Meteor.publish('comments', function(postId) {
  check(postId, String);
  return Comments.find({postId: postId});
});
// Give authorized users access to sensitive data by group
Meteor.publish('secrets', function (group) {
  if (Roles.userIsInRole(this.userId, ['view-secrets','admin'], group)) {

    return Meteor.secrets.find({group: group});

  } else {

    // user not authorized. do not publish secrets
    this.stop();
    return;

  }
});

