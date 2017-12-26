import { Blaze } from 'meteor/blaze';
Template.commentMinipop.onCreated(function(){

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
	'click':function(e, t){
		if($(e.target).closest('#comment-edit-box').length == 0){
			var view = Blaze.getView($("#comment-edit-box")[0]);
			Blaze.remove(view);
		}
	},
	'click #edit_comment': function (e, t) {
		e.preventDefault()

		var itemId = Blaze.getData().commentObj.itemId;
		var target = Blaze.getData().commentObj.parentTarget;
		console.log(itemId);
		console.log(target);
		target.children().hide();
		var view = Blaze.getView($("#comment-edit-box")[0]);
		Blaze.remove(view);

		Blaze.renderWithData(Template.comment_edit, Comments.findOne(itemId), target[0])
	},
	'click #delete_comment': function (e, t) {
		e.preventDefault()

		var myalert = new MyAlert();
		var callback = {
			fn: function() {
				var itemId = Blaze.getData().commentObj.itemId;
				var view = Blaze.getView($("#comment-edit-box")[0]);
				Blaze.remove(view);
				Comments.remove(itemId);
			}
		}
		myalert.deleteConfirm(callback);
	}
});