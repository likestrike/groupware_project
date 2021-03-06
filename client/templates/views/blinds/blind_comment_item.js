Template.blind_commentItem.helpers({
	formattedDate: function(){
		moment.locale('ko');
		return moment(this.submitted).format("LLL");
	},
	ownComment: function(){
		var loggedInUser = Meteor.user();
		if(loggedInUser){
			if (Roles.userIsInRole(loggedInUser, ['admin'], 'default-group')){
		  		return true;
			}
		}
		return this.userId === Meteor.userId();
	}
});
Template.blind_commentItem.events({
	'click #edit_comment': function (e, t) {
		e.preventDefault()
		var itemId = this._id;
		var target = $(e.target).parents('.box-comments');
		// target.append('test');
		// Comments.findOne(itemId);
		target.children().hide()
		Blaze.renderWithData(Template.comment_edit, BlindComments.findOne(itemId), $(e.target).parents('.box-comments')[0])
		// Modal.show('postEditModal', function () {
		// 	return Posts.findOne(itemId);
		// });
	}
});

Template.blind_comment_edit.events({
	'click #comment_update': function (e, t) {
		e.preventDefault();
		var $body = $(e.target).parents('#comment_edit_form');
	    var comment = {
	      body: $body.find('#edit_comment_text').html()
	    };
		var currentCommentId = this._id;
		BlindComments.update(currentCommentId, {$set: comment}, function(error) {
	      if (error) {
	        // display the error to the user
	        return Bert.alert(error.reason);
	      } else {
	        var view = Blaze.getView($("#comment_edit_form")[0]);
			Blaze.remove(view);
	      }
	    });
	},
	'click #comment_cancel': function (e, t) {
		e.preventDefault();
		$("#comment_edit_form").prev().show();
		var view = Blaze.getView($("#comment_edit_form")[0]);
		Blaze.remove(view);
	}
});