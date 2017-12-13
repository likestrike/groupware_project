Template.blindModal.events({
	'keydown #blind_context_text': function (e, t) {
		if($('#update').hasClass('disabled')){
			$('#update').removeClass('disabled');
		}
		var value = $(e.target).val();
	    $('#blind_context').html(value);
	},
	'keyup #blind_context_text': function (e, t) {
		var value = $(e.target).val();
	    $('#blind_context').html(value);
	    $('.blind-form-area').css({
	    	height : $('#blind_context').height() + 'px'
	    })
		if (e.keyCode !== 13) return;
	},
	'click #submit' : function (e, t) {
		var conver_text = $('#blind_context').html().replace(/\n/g, "<br />");

		if(conver_text.trim() === ''){
			Modal.hide('blindModal');
			return;
		}
		var post = {
			context : conver_text
		}
		Meteor.call('blindInsert', post, function(error, result) {
	      // display the error to the user and abort
	      if (error)
	        return Bert.alert(error.reason);

	    	Modal.hide('blindModal');
	      // Router.go('postPage', {_id: result._id});
	        FlowRouter.go('/blindlist');
	    });
	},
});