import { Blaze } from 'meteor/blaze';
Template.commentMinipop.onCreated(function(){
	console.log(Blaze.getData().itemId);
	// console.log(this.itemId);
	$(document).on('click', function(e){
		if($(e.target).closest('#comment-edit-box').length == 0){
			var view = Blaze.getView($("#comment-edit-box")[0]);
			Blaze.remove(view);
		}
	});
});
Template.commentMinipop.helpers({
	attr: function () {
		var attributes = {};
		var top = Blaze.getData().commentObj.top;
		var left = Blaze.getData().commentObj.left;
		attributes.style = "position:absolute; top: "+top+"px; left: "+left+"px";
		return attributes;
	}
});
Template.commentMinipop.events({
	'click #edit_comment': function (e, t) {
		e.preventDefault()

		var itemId = Blaze.getData().commentObj.itemId;
		var target = Blaze.getData().commentObj.target;
		target.children().hide()
		Blaze.renderWithData(Template.comment_edit, Comments.findOne(itemId), Blaze.getData().commentObj.target[0])
	}
});