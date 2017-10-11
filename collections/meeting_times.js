MeetingTimes = new Mongo.Collection('meeting_times');

MeetingTimes.allow({
  update: ownsDocument,
  remove: ownsDocument
});
MeetingTimes.deny({
  update: function(userId, comment, fieldNames) {
    return (_.without(fieldNames, 'body').length > 0);
  }
});

Meteor.methods({
  meetingTimeInsert: function(Attribute) {
    check(this.userId, String);
    check(Attribute, {
      title : String,
      start : String,
      end: String
    });

    var user = Meteor.user();
    var mettings = _.extend(Attribute, {
      userId: user._id,
      author: user.profile.fullname,
      submitted: new Date()
    });

    var meetId = MeetingTimes.insert(mettings);

    return {
      _id: meetId
    };
  }
});