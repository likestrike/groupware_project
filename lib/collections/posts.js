Posts = new Mongo.Collection('posts');

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
      submitted: new Date()
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
  }
});