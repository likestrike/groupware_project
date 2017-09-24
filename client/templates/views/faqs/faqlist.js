Template.faqlist.events({
	'click #faq-modal': function (e, t) {
		e.preventDefault()
		Modal.show('faqModal');
	}
});
Template.faqlist.helpers({
	faqs: function() {
		return Faqs.find({},{sort : {submitted : 0}}).map(function(faq, index) {
      		faq.no = (index+1);
      		return faq;
    	});
	}
});

Template.faqModal.onRendered(function () {
	$(document).ready(function() {
	  $('#text_editor').summernote();
	});
});

Template.faqModal.events({
	'keydown #faq_title': function (e, t) {
		if($('#submit').hasClass('disabled')){
			$('#submit').removeClass('disabled');
		}
	},
	'click #submit' : function (e, t) {
		var sourceHtmlText = $('#text_editor').summernote('code');

		var faq = {
			title : $('#faq_title').val(),
			body : sourceHtmlText
		}
		Meteor.call('faqInsert', faq, function(error, result) {
	      // display the error to the user and abort
	      if (error)
	        return Bert.alert(error.reason);

	    	Modal.hide('faqModal');

	        FlowRouter.go('/faqlist');
	    });
	},
});