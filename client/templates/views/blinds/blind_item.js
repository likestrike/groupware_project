Template.blindItem.helpers({
	formattedDate: function(){
		return moment(this.submitted).format("dddd, MMMM Do YYYY, h:mm:ss");
	},
	comments: function() {
		Meteor.subscribe('blind_comments', this._id);
	    // return Comments.find({postId: this._id}, {sort: {submitted: -1}, limit: 2});
	    return BlindComments.find({blindId: this._id});
	}
});

Template.blindItem.events({
	'submit form': function (e, t) {
		e.preventDefault();
		var $body = $(e.target).find('#comment');
	    var comment = {
	      body: $body.html(),
	      blindId: this._id
	    };

	 //    var errors = {};
	 //    if (! comment.body) {
	 //      errors.body = "Please write some content";
	 //      return Session.set('commentSubmitErrors', errors);
	 //    }

	    Meteor.call('blind_commentInsert', comment, function(error, commentId) {
	      if (error){
	        throwError(error.reason);
	      } else {
	        $body.empty();
	      }
	    });
	},
	'click #edit_blind':function(e, t){
		e.preventDefault()
		var itemId = this._id;
		Modal.show('blindEditModal', function () {
			return Blinds.findOne(itemId);
		});
		// Modal.show('postEditModal');
	},
	'click #delete_blind':function(e, t){
		e.preventDefault()
		var currentPostId = this._id;
		var myalert = new MyAlert();
		var callback = {
			fn: function() {
				Blinds.remove(currentPostId);
	      		FlowRouter.go('/blindlist');
			}
		}
		myalert.deleteConfirm(callback);
	}
});