Template.commentItem.helpers({
	writer: function() {
		Meteor.subscribe('user');
		// return Meteor.users.find({'profile' : {_id: this.userId}});
		return Meteor.users.findOne(this.userId);
	},
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
	},
	getdata:function(){
		return this.fileId;
	},
});
Template.commentItem.events({
	'click [data-toggle="dropdown"]':function(e,t){
		var target = $(e.currentTarget);
		if(target.parent().hasClass('open')){
			console.log('open');
			var view = Blaze.getView($("#comment-edit-box")[0]);
			Blaze.remove(view);
			return;
		}

		if($('body').find('#comment-edit-box').length > 0){
			var view = Blaze.getView($("#comment-edit-box")[0]);
			Blaze.remove(view);
		}
		var _top = $(e.target).offset().top + 20;
		var _left = $(e.target).offset().left - 140;

		var itemId = this._id;
		var commentObj = {
			itemId : this._id,
			target : $(e.target).parents('.box-comments'),
			top : _top,
			left : _left
		}
		Blaze.renderWithData(Template.commentMinipop, {commentObj: commentObj}, $("body")[0])

	},
	'click #edit_comment': function (e, t) {
		e.preventDefault()
		var itemId = this._id;
		var target = $(e.target).parents('.box-comments');
		target.children().hide()
		Blaze.renderWithData(Template.comment_edit, Comments.findOne(itemId), $(e.target).parents('.box-comments')[0])
	},

});
Template.comment_edit.onCreated(function() {

});
Template.comment_edit.events({
	'click #comment_update': function (e, t) {
		e.preventDefault();
		var $body = $(e.target).parents('#comment_edit_form');
	    var comment = {
	      body: $body.find('#edit_comment_text').html()
	    };
		var currentCommentId = this._id;
		Comments.update(currentCommentId, {$set: comment}, function(error) {
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
	},
	'click #file_remove': function(e, t){
		e.preventDefault()
	    var itemId = e.currentTarget.dataset.value;
	    $(e.currentTarget).parents('.uploaded').remove();

	    t.delItems.push(itemId);
	}
});