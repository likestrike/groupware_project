import { Blaze } from 'meteor/blaze'

Template.tagviewer.helpers({
	tag : function () {
		return this.tag;
	}
});
Template.tagviewer.onCreated(function(){
	console.log('onload');
	console.log(this.tag);
	var test = this.tag;
});

Template.tagviewer.events({
	'click #tag_remove':function(){
		Blaze.remove(Blaze.currentView);
	}
});