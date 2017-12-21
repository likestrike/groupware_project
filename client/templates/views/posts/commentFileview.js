import { _app, Collections } from '/lib/core.js';
Template.commentfileView.helpers({
	Images: function () {
		var ids = Template.instance().data;
		if(ids == undefined || ids.length == 0){
  			return false;
  		}
		return Collections.files.find({'_id' : ids, 'isImage' : true});
	},
});