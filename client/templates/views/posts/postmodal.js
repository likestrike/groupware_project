Template.postModal.profileImage = function() {
	var user = Meteor.user(); 
	if (user) {
		return user.services.google.picture; 
	} 
};
Template.postModal.events({
	'keydown textarea': function (e, t) {
		if($('#submit').hasClass('disabled')){
			$('#submit').removeClass('disabled');
		}
	},
	'click #submit' : function (e, t) {
		var post = {
			context : $('#post_context').val()
		}
		Meteor.call('postInsert', post, function(error, result) {
	      // display the error to the user and abort
	      if (error)
	        return alert(error.reason);

	      // Router.go('postPage', {_id: result._id});  
	    });
	}

});