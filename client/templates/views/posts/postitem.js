Template.postItem.helpers({
	writer: function() {
		Meteor.subscribe('user');
		// return Meteor.users.find({'profile' : {_id: this.userId}});
		return Meteor.users.findOne(this.userId);
	},
	formattedDate: function(){
		moment.locale('ko');
		return moment(this.submitted).format("LLL");
	},
	comments: function() {
		Meteor.subscribe('comments', this._id);
	    // return Comments.find({postId: this._id}, {sort: {submitted: -1}, limit: 2});
	    return Comments.find({postId: this._id});
	},
	ownPost: function(){
		var loggedInUser = Meteor.user();
		if(loggedInUser){
			if (Roles.userIsInRole(loggedInUser, ['admin'], 'default-group')){
		  		return true;
			}
		}
		return this.userId === Meteor.userId();
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
	},
	'click #edit_post':function(e, t){
		e.preventDefault()
		var itemId = this._id;
		Modal.show('postEditModal', function () {
			return Posts.findOne(itemId);
		});
		// Modal.show('postEditModal');
	},
	'click #delete_post':function(e, t){
		e.preventDefault()
		var currentPostId = this._id;
		var myalert = new MyAlert();
		var callback = {
			fn: function() {
				Posts.remove(currentPostId);
	      		FlowRouter.go('/postlist');
			}
		}
		myalert.deleteConfirm(callback);
	}
});