Template.faqItem.events({
	'click #edit_faq': function (e, t) {
		e.preventDefault()
		var itemId = this._id;
		Modal.show('faqEditModal', function () {
			return Faqs.findOne(itemId);
		});
	},
	'click #delete_faq':function(e, t){
		e.preventDefault()
		if (confirm("해당 글을 삭제 합니까?")) {
	      var currentFaqId = this._id;
	      Faqs.remove(currentFaqId);
	      FlowRouter.go('/faqlist');
	    }
	}
});
Template.faqItem.helpers({
	ownFaq: function(){
		var loggedInUser = Meteor.user();
		if(loggedInUser){
			if (Roles.userIsInRole(loggedInUser, ['admin'], 'default-group')){
		  		return true;
			}
		}
		return this.userId === Meteor.userId();
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