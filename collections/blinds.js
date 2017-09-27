Blinds = new Mongo.Collection('blinds');

Blinds.allow({
  update: ownsDocument,
  remove: ownsDocument
});
Blinds.deny({
  update: function(userId, doc, fieldNames) {
    return (_.without(fieldNames, 'context').length > 0);
  }
});

Meteor.methods({
  blindInsert: function(Attributes) {
    check(this.userId, String);
    check(Attributes, {
      context: String
    });

    var user = Meteor.user();
    var doc = _.extend(Attributes, {
      userId: user._id,
      author: 'Unknown',
      submitted: new Date()
    });

    var blindId = Blinds.insert(doc);

    return {
      _id: blindId
    };
  },
});