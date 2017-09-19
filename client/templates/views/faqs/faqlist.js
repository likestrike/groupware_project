Template.faqlist.events({
	'click #faq-modal': function (e, t) {
		e.preventDefault()
		Modal.show('faqModal');
	}
});


Template.faqModal.onRendered(function () {
	$(document).ready(function() {
	  $('#text_editor').summernote();
	});
});