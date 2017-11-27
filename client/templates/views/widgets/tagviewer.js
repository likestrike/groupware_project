Template.tagviewer.helpers({
	tag : function () {
		console.log(Session.get('metas'));
		return Session.get('metas');
	}
});