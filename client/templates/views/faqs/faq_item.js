Template.faqItem.events({
	'click #edit_faq': function (e, t) {
		e.preventDefault()
		var itemId = this._id;
		Modal.show('faqEditModal', function () {
			return Faqs.findOne(itemId);
		});
	}
});
Template.faqEditModal.onRendered(function () {
	$(document).ready(function() {
	  $('#text_editor').summernote();
	});
	$('#update').removeClass('disabled');
});
Template.faqEditModal.events({
	'click #update' : function (e, t) {
		var sourceHtmlText = $('#text_editor').summernote('code');

		var faq = {
			title : $('#faq_title').val(),
			body : sourceHtmlText
		}
		var currentFaqId = this._id;
		console.log(currentFaqId);
		Faqs.update(currentFaqId, {$set: faq}, function(error) {
	      if (error) {
	      	console.log(error);
	        // display the error to the user
	        return Bert.alert(error.reason);
	      } else {
	      	Modal.hide('faqEditModal');
	        FlowRouter.go('/faqlist');
	      }
	    });
	},
});