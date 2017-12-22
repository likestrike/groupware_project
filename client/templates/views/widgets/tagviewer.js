import { Blaze } from 'meteor/blaze'

Template.tagviewer.helpers({
	tag : function () {
		return this.tag;
	}
});
Template.tagviewer.onCreated(function(){
	var test = this.tag;
});

Template.tagviewer.events({
	'click #tag_remove':function(){
		Blaze.remove(Blaze.currentView);
	}
});