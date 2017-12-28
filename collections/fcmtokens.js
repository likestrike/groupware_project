FcmTokens = new Mongo.Collection('fcmtokens');

FcmTokens.allow({
  remove : function(){
    return true;
  }
})
FcmTokens.deny({
  update: function(userId, doc, fieldNames) {
    return true;
  },
  remove : function(){
    return false;
  }
});

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