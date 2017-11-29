
Template.postlist.helpers({
	posts: function() {
		return Posts.find({},{sort : {submitted : -1}});
	}
});
Template.postlist.onRendered(function (){
	var postData = this.data.posts;
	
	console.log(postData);
})
Template.postlist.events({
	'click #post-modal': function (e, t) {
		e.preventDefault()
		// var options = {backdrop: 'static', keyboard: false};
		Modal.show('postModal');
	}
});
