Template.tagviewer.helpers({
	tag : function () {
		console.log(this.tag);
		console.log(Session.get('metas'));
		return Session.get('metas');
	}
});