Template.blindModal.events({
	'click #submit' : function (e, t) {
		var post = {
			context : $('#blind_context').html()
		}
		Meteor.call('boardInsert', post, function(error, result) {
	      // display the error to the user and abort
	      if (error)
	        return Bert.alert(error.reason);

	    	Modal.hide('blindModal');
	      // Router.go('postPage', {_id: result._id});
	        FlowRouter.go('/blindlist');
	    });
	},


});