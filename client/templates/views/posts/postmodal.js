// sesstion post note를 줘서 div에 복사하는 방식. textarea의 스크롤이나 여려 이벤트를 처리할게 많아서 일단 보류.
// Template.postModal.helpers({
// 	postNote: function () {
// 		var postNote = Session.get("postNote");
// 		//do processing
// 		if(postNote!='')return postNote;
// 	}
// });
import { Blaze } from 'meteor/blaze'

Template.postModal.events({
	'keydown #post_context_text': function (e, t) {
		// var value = $(e.target).val();
  //    	Session.set("postNote", value);
		if($('#submit').hasClass('disabled')){
			$('#submit').removeClass('disabled');
		}
		var value = $(e.target).val();

	    $('#post_context').html(value);
	},
	'keyup #post_context_text': function (e, t) {
		if (e.keyCode !== 13) return;
		var url_val = urlify($(e.target).val());
		const url = url_val;
		if(url != ''){
			console.log('url : ' + url);
			Meteor.call('Extractor_meta', url, (err, res) => {
				if (err) {
					console.error('err while extracting metas', err);
				} else {
					console.log(res);
					if(jQuery.isEmptyObject(res))return;

					Blaze.renderWithData(Template.tagviewer, {tag: res}, $(".modal-body")[0])
				}
			});
			// extractMeta(url, (err, res) => {
			// 	if (err) {
			// 		console.error('err while extracting metas', err);
			// 	} else {
			// 		Blaze.renderWithData(Template.tagviewer, {tag: res}, $(".modal-body")[0])
			// 	}
			// });
		}

	},
	'click #submit' : function (e, t) {
		var conver_text = $('#post_context').html().replace(/\n/g, "<br />");

		var post = {
			context : conver_text
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

function urlify(text) {
    var urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    return text.replace(urlRegex, function(url) {
        return url;
    })
}