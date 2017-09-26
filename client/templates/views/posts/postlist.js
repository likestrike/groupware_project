
Template.postlist.helpers({
	posts: function() {
		return Posts.find({},{sort : {submitted : -1}});
	}
});
Template.postlist.onRendered(function (){
	console.log('render');
	var test = posts;
	console.log(test)
})
Template.postlist.events({
	'click #post-modal': function (e, t) {
		e.preventDefault()
		Modal.show('postModal');
	}
});
