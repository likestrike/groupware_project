
Meteor.publish("userAll", function () {
	return Meteor.users.find();
});
Meteor.publish('user', function () {
  return Meteor.users.find({}, {fields: {'profile': 1}});
});
Meteor.publish('userProfile', function (param) {
  check(param, Object);
  return Meteor.users.find({_id : param._id}, {fields: {profile: 1}});
});
Meteor.publish('userCount', function (param) {
  check(param, String);
  return Meteor.users.find({'emails.address' : param}).count();
});
Meteor.publish('singlePost', function (param) {
  check(param, Object);
  return Posts.find({_id : param._id});
});
// 게시판 구독
Meteor.publish('posts', function() {
  return Posts.find();
});
// 댓글 구독
Meteor.publish('comments', function(postId) {
  check(postId, String);
  return Comments.find({postId: postId});
});
// 알림 구독
Meteor.publish('notifications', function() {
  return Notifications.find({userId: this.userId});
});
// Faq 구독
Meteor.publish('faqs', function() {
  return Faqs.find();
});
// 블라인드 구독
Meteor.publish('blinds', function() {
  return Blinds.find();
});
Meteor.publish('singleBlind', function (param) {
  check(param, Object);
  return Blinds.find({_id : param._id});
});
// 블라인드 댓글 구독
Meteor.publish('blind_comments', function(blindId) {
  check(blindId, String);
  return BlindComments.find({blindId: blindId});
});

// ogtag
Meteor.publish('ogtags', function() {
  return Ogtags.find();
});
// fcmtoken
Meteor.publish('fcmtoken', function() {
  return FcmTokens.find();
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

// 회의실 예약 시간 구독
// 날짜 지정 parameter setting
Meteor.publish('meeting_times', function() {
  return MeetingTimes.find();
});

