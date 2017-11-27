
// sesstion post note를 줘서 div에 복사하는 방식. textarea의 스크롤이나 여려 이벤트를 처리할게 많아서 일단 보류.
if(Meteor.isClient){
	Session.set('metas', '');
	function getURL = function(text){
		var urlRegex = /(http(s)?:\/\/[^ \n>]*)|\"(http(s)?:\/\/+)+[^"]*\"/gm; 
		return text.replace(urlRegex, function(url) {
	    	var html = url.replace(/\"/g, "");
	    	return html;
	    })
	}
}
Template.postModal.helpers({
	// postNote: function () {
	// 	var postNote = Session.get("postNote");
	// 	//do processing
	// 	if(postNote!='')return postNote;
	// }
	metas() { return Session.get('metas'); },
});

Template.postModal.events({
	'keydown #post_context': function (e, t) {
		// var value = $(e.target).val();
  //    	Session.set("postNote", value);
		if($('#submit').hasClass('disabled')){
			$('#submit').removeClass('disabled');
		}
	},
	'keyup #post_context' : function(e, t){
		if (e.keyCode !== 13) return;
		var test = $('#post_context').html();
		var test = $.getURL(test);
		console.log(test);
		const url = $('#post_context').html();
		console.log('extract', url);
		Session.set('metas', 'Extracting ' + url + '...');
		extractMeta(url, (err, res) => {
			if (err) {
				console.error('err while extracting metas', err);
				Session.set('metas', 'Error: ' + err);
			} else {
				console.log(JSON.stringify(res, null, '  '));
				Session.set('metas', JSON.stringify(res, null, '  '));
			}
		});
	},
	'click #submit' : function (e, t) {
		var post = {
			context : $('#post_context').html()
		}
		Meteor.call('postInsert', post, function(error, result) {
	      // display the error to the user and abort
	      if (error)
	        return Bert.alert(error.reason);

	    	Modal.hide('postModal');
	      // Router.go('postPage', {_id: result._id});
	        FlowRouter.go('/postlist');
	    });
	},


});
Template.postEditModal.events({
	'keydown #post_context': function (e, t) {
		if($('#update').hasClass('disabled')){
			$('#update').removeClass('disabled');
		}
	},
	'click #update' : function (e, t) {
		var post = {
			context : $('#post_context').html()
		}
		var currentPostId = this._id;
		Posts.update(currentPostId, {$set: post}, function(error) {
	      if (error) {
	        // display the error to the user
	        return Bert.alert(error.reason);
	      } else {
	      	Modal.hide('postModal');
	        FlowRouter.go('/postlist');
	      }
	    });
	},
});
