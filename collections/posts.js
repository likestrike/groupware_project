Posts = new Mongo.Collection('posts');

Posts.allow({
  update: ownsDocument,
  remove: ownsDocument
});
Posts.deny({
  update: function(userId, post, fieldNames) {
    return (_.without(fieldNames, 'context').length > 0);
  }
});

Meteor.methods({
  postInsert: function(postAttributes) {
    check(this.userId, String);
    check(postAttributes, {
      context: String
    });

    var user = Meteor.user();
    var post = _.extend(postAttributes, {
      userId: user._id,
      author: user.username,
      submitted: new Date(),
      commentsCount : 0
    });

    var postId = Posts.insert(post);

    return {
      _id: postId
    };
  },
  addUsers : function (postAttributes) {
  	check(this.userId, String);
  	check(postAttributes, Object);
  	var post = _.extend(postAttributes)
  	var postId = Meteor.users.insert(post);
  	return {
      _id: postId
    };
  },
});