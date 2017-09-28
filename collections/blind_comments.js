BlindComments = new Mongo.Collection('blind_comments');

BlindComments.allow({
  update: ownsDocument,
  remove: ownsDocument
});
BlindComments.deny({
  update: function(userId, comment, fieldNames) {
    return (_.without(fieldNames, 'body').length > 0);
  }
});

Meteor.methods({
  blind_commentInsert: function(commentAttributes) {
    check(this.userId, String);
    check(commentAttributes, {
      blindId: String,
      body: String
    });
    var user = Meteor.user();
    var blind = Blinds.findOne(commentAttributes.blindId);
    if (!blind)
      throw new Meteor.Error('invalid-comment', 'You must comment on a post');
    comment = _.extend(commentAttributes, {
      userId: user._id,
      author: 'Unknown',
      submitted: new Date()
    });

    Blinds.update(comment.blindId, {$inc: {commentsCount: 1}});

     // create the comment, save the id
    comment._id = BlindComments.insert(comment);
    return comment._id;
  }
});