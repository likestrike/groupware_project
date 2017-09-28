
Template.blindlist.helpers({
	blinds: function() {
		return Blinds.find({},{sort : {submitted : -1}});
	}
});

Template.blindlist.events({
	'click #blind-modal': function (e, t) {
		e.preventDefault()
		Modal.show('blindModal');
	}
});
