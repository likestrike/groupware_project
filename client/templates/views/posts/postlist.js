import { Blaze } from 'meteor/blaze';
var targetIndex = 0;
Template.postlist.helpers({
	posts: function() {
		return Posts.find({}, {sort: {submitted: -1}}).map(function(v, i) {
	      	v.index = i;
			return v;
	    });
	}, 
	seperate: function(){
		var index = this.index;
		var result = (index%3);
		targetIndex++;
		if(result == 0){
			targetIndex = 0;
		}
		Blaze.renderWithData(Template.postItem, {post : this}, $(".col-md-4")[targetIndex])
	}
});
Template.postlist.events({
	'click #post-modal': function (e, t) {
		e.preventDefault()
		// var options = {backdrop: 'static', keyboard: false};
		Modal.show('postModal');
	}
});
