Template.postItem.helpers({
	writer: function() {
		Meteor.subscribe('user');
		// return Meteor.users.find({'profile' : {_id: this.userId}});
		return Meteor.users.findOne(this.userId);
	},
	formattedDate: function(){
		return moment(this.submitted).format("dddd, MMMM Do YYYY, h:mm:ss");
	},
	comments: function() {
		Meteor.subscribe('comments', this._id);
	    return Comments.find({postId: this._id});
	}
});

Template.postlist.events({
	'submit form': function (e, t) {
		e.preventDefault();
		var $body = $(e.target).find('#comment');
	    var comment = {
	      body: $body.html(),
	      postId: this._id
	    };

	 //    var errors = {};
	 //    if (! comment.body) {
	 //      errors.body = "Please write some content";
	 //      return Session.set('commentSubmitErrors', errors);
	 //    }

	    Meteor.call('commentInsert', comment, function(error, commentId) {
	      if (error){
	        throwError(error.reason);
	      } else {
	        $body.empty();
	      }
	    });
	}
});