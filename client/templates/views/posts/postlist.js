Template.postlist.onCreated(function () {

});

Template.postlist.events({
	'click #post-modal': function (e, t) {
		e.preventDefault()
		Modal.show('postModal');
	}
});
