// Template.blind.onRendered(function () {
// });
Template.blindlist.events({
	'click #blindModal': function (e, t) {
		e.preventDefault()
		Modal.show('blindModal');
	}
});