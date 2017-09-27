
Template.blindlist.helpers({
	blinds: function() {
		return Blinds.find({},{sort : {submitted : -1}});
	}
});

Template.blindlist.events({
	'click #board-modal': function (e, t) {
		e.preventDefault()
		Modal.show('boardModal');
	}
});
