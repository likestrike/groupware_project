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
      context: String,
      fileIds: Array
    });

    var names = [
     "지나가던 방랑자",
     "오늘밤 주인공은 나야나",
     "ilieiiseif",
     "iiiiiiioiii",
     "보노보노",
     "일곱난장이",
     "월급루팡",
     "칼퇴요정",
     "Unknowm",
     "33780208",
     "820810",
     "가라! 법카충!"
    ];
    function getMessage() {
       return names[Math.floor(Math.random() * names.length)];
    }
    var randomName = getMessage();

    var user = Meteor.user();
    var doc = _.extend(Attributes, {
      userId: user._id,
      author: randomName,
      submitted: new Date()
    });

    var blindId = Blinds.insert(doc);

    return {
      _id: blindId
    };
  },

});