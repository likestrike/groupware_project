
Template.postlist.helpers({
	posts: function() {
		return Posts.find({},{sort : {submitted : -1}});
	}
});
Template.postlist.events({
	'click #post-modal': function (e, t) {
		e.preventDefault()
		Modal.show('postModal');
	}
});
