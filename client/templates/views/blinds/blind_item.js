Template.blindItem.helpers({
	formattedDate: function(){
		moment.locale('ko');
		return moment(this.submitted).format("LLL");
	},
	comments: function() {
		Meteor.subscribe('blind_comments', this._id);
	    // return Comments.find({postId: this._id}, {sort: {submitted: -1}, limit: 2});
	    return BlindComments.find({blindId: this._id});
	},
	ownPost: function(){
		var loggedInUser = Meteor.user();
		if(loggedInUser){
			if (Roles.userIsInRole(loggedInUser, ['admin'], 'default-group')){
		  		return true;
			}
		}
		return this.userId === Meteor.userId();
	},
	getdata: function(){
  		return this.fileIds;
  	},
});

Template.blindItem.events({
	'submit form': function (e, t) {
		e.preventDefault();

		var $body = $(e.target).find('#comment');
	    var comment = {
	      body: $body.html(),
	      blindId: this._id
	    };
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
	},


});