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
      context: String,
      fileIds: Array
    });

    var user = Meteor.user();
    var post = _.extend(postAttributes, {
      userId: user._id,
      author: user.username,
      submitted: new Date(),
      commentsCount : 0,
      likes : 0,
      likers : []
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
  postLiked : function(postId){
    check(this.userId, String);
    check(postId, String);

    //get this posts array of likers
    var res = Posts.find( { _id: postId}, { likers: 1}).fetch()[0].likers;

    //see if the current user is one of them
     var q = _.find(res, (x) => x == Meteor.userId() );

    //need to disallow same user that liked to like again
    if ( q == Meteor.userId() ){
      Posts.update({_id : postId}, {$inc: {likes: -1}, $pull: { likers:  Meteor.userId() }});
    }else{
      Posts.update({_id : postId}, {$inc: {likes: 1}, $push: { likers:  Meteor.userId() }});
    }

  }
});