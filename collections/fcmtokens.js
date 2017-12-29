FcmTokens = new Mongo.Collection('fcmtokens');

FcmTokens.allow({
  update: function () { return true; },
  remove: function () { return true; }
});
// FcmTokens.deny({
//   update: function(userId, doc, fieldNames) {
//     return true;
//   },
//   remove : function(){
//     return true;
//   }
// });

Meteor.methods({
  fcmInsert: function(Attribute) {
    check(this.userId, String);
    check(Attribute, Object);

    var user = Meteor.userId();
    var fcm = _.extend(Attribute, {
      userId: user,
      submitted: new Date()
    });

    var meetId = FcmTokens.insert(fcm);

    return {
      _id: meetId
    };
  }
});