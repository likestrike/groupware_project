import { Blaze } from 'meteor/blaze';
import { Template }          from 'meteor/templating';
import { ClientStorage }     from 'meteor/ostrio:cstorage';
import { _app, Collections } from '/lib/core.js';
import { filesize }          from 'meteor/mrt:filesize';
import Images from '/collections/images.js';

var screenSizes = {
  xs: 480,
  sm: 768,
  md: 992,
  lg: 1200
};

Template.postModal.onCreated(function() {
	const self          = this;
	this.error          = new ReactiveVar(false);
	this.uploadQTY      = 0;
	this.showSettings   = new ReactiveVar(false);

	_app.blamed   = new ReactiveVar(ClientStorage.get('blamed'));
	_app.unlist   = new ReactiveVar(ClientStorage.get('unlist'));
	_app.secured  = new ReactiveVar(ClientStorage.get('secured'));
	_app.uploads  = new ReactiveVar(false);

	this.initiateUpload = (event, files) => {
		if (_app.uploads.get()) {
		  return false;
		}
		if (!files.length) {
		  this.error.set('Please select a file to upload');
		  return false;
		}
		if (files.length > 6) {
		  this.error.set('Please select up to 6 files');
		  return false;
		}
	this.uploadQTY = files.length;
	const cleanUploaded = (current) => {
	  const _uploads = _.clone(_app.uploads.get());
	  if (_.isArray(_uploads)) {
	    _.each(_uploads, (upInst, index) => {
	      if (upInst.file.name === current.file.name) {
	        _uploads.splice(index, 1);
	        if (_uploads.length) {
	          _app.uploads.set(_uploads);
	        } else {
	          this.uploadQTY = 0;
	          _app.uploads.set(false);
	        }
	      }
	    });
	  }
	};
	// 로그인한 사람이 올린 파일 여부, list 여부, time to live.
	let secured, unlisted, ttl;
	const uploads = [];
	const transport = ClientStorage.get('uploadTransport');
	const created_at = +new Date();
	if (Meteor.userId()) {
	  secured = _app.secured.get();
	  if (!_.isBoolean(secured)) {
	    secured = false;
	  }
	  if (secured) {
	    unlisted = true;
	  } else {
	    unlisted = _app.unlist.get();
	    if (!_.isBoolean(unlisted)) {
	      unlisted = true;
	    }
	  }
	  ttl = new Date(created_at + _app.storeTTLUser);
	} else {
	  unlisted = false;
	  secured = false;
	  ttl = new Date(created_at + _app.storeTTL);
	}

	_.each(files, (file, i) => {
	  Collections.files.insert({
	    file: file,
	    meta: {
	      blamed: 0,
	      secured: secured,
	      expireAt: ttl,
	      unlisted: unlisted,
	      downloads: 0,
	      category : 'post',
	      created_at: created_at - 1 - i
	    },
	    streams: 'dynamic',
	    chunkSize: 'dynamic',
	    transport: transport
	  }, false).on('end', function (error, fileObj) {
	    if (!error) {
			Blaze.renderWithData(Template.postFile, {itemId: fileObj._id}, $("#upload-file")[0])
	    	
	      // FlowRouter.go('file', {
	      //   _id: fileObj._id
	      // });
	    }
	    cleanUploaded(this);
	  }).on('abort', function () {
	    cleanUploaded(this);
	  }).on('error', function (error) {
	    console.error(error);
	    self.error.set((self.error.get() ? self.error.get() + '<br />' : '') + this.file.name + ': ' + ((error != null ? error.reason : void 0) || error));
	    Meteor.setTimeout( () => {
	      self.error.set(false);
	    }, 15000);
	    cleanUploaded(this);
	  }).on('start', function() {
	    uploads.push(this);
	    _app.uploads.set(uploads);
	  }).start();
	});
	return true;
	};

});
Template.postModal.helpers({
  error() {
    return Template.instance().error.get();
  },
  uploads() {
    return _app.uploads.get();
  },
  attribute(){
  	var attributes = {};
  	if ($(window).width() <= (screenSizes.sm - 1) ){
  		attributes.style = "position:fixed; top: 0; left: 0; bottom:0; right:0; margin:0;";
  	}
	return attributes;
  },
   status() {
    let i                = 0;
    const uploads        = _app.uploads.get();
    let progress         = 0;
    const uploadQTY      = Template.instance().uploadQTY;
    let estimateBitrate  = 0;
    let estimateDuration = 0;
    let onPause          = false;

    if (uploads) {
      for (let j = 0; j < uploads.length; j++) {
        onPause = uploads[j].onPause.get();
        progress += uploads[j].progress.get();
        estimateBitrate += uploads[j].estimateSpeed.get();
        estimateDuration += uploads[j].estimateTime.get();
        i++;
      }

      if (i < uploadQTY) {
        progress += 100 * (uploadQTY - i);
      }

      progress         = Math.ceil(progress / uploadQTY);
      estimateBitrate  = filesize(Math.ceil(estimateBitrate / i), { bits: true }) + '/s';
      estimateDuration = (() => {
        const duration = moment.duration(Math.ceil(estimateDuration / i));
        let hours = '' + (duration.hours());
        if (hours.length <= 1) {
          hours = '0' + hours;
        }

        let minutes = '' + (duration.minutes());
        if (minutes.length <= 1) {
          minutes = '0' + minutes;
        }

        let seconds = '' + (duration.seconds());
        if (seconds.length <= 1) {
          seconds = '0' + seconds;
        }
        return hours + ':' + minutes + ':' + seconds;
      })();
    }

    return {
      progress: progress,
      estimateBitrate: estimateBitrate,
      estimateDuration: estimateDuration,
      onPause: onPause
    };
  },
});
Template.postModal.events({
	'keydown #post_context_text': function (e, t) {
		if($('#submit').hasClass('disabled')){
			$('#submit').removeClass('disabled');
		}
	},
	'keyup #post_context_text': function (e, t) {
		var value = $(e.target).val();
	    $('#post_context').html(value);
	    $('.post-form-area').css({
	    	height : $('#post_context').height() + 'px'
	    })
		if (e.keyCode !== 13) return;
		var url_val = urlify($(e.target).val());
		const url = url_val;
		if(url != ''){
			// extract metadata ogtag
			Meteor.call('Extractor_meta', url, (err, res) => {
				if (err) {
					console.error('err while extracting metas', err);
				} else {
					if(jQuery.isEmptyObject(res))return;
					Blaze.renderWithData(Template.tagviewer, {tag: res}, $(".modal-body")[0])
				}
			});
		}
	},
	'click #submit' : function (e, t) {
		e.preventDefault();
		e.stopPropagation();
		var conver_text = $('#post_context').html().replace(/\n/g, "<br />");

		if(conver_text.trim() === '' && $('.post_uploaded_image').length == 0){
			Modal.hide('postModal');
			return;
		}

		// get image ids
		var file_ids = [];
		if($('.post_uploaded_image').length >0){
			$('.post_uploaded_image').each(function(){
				file_ids.push($(this).data('value'));
				var fildId = $(this).data('value');
			});
		}

		var post = {
			context : conver_text,
			fileIds : file_ids
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
	'click #fakeUpload'(e, template) {
		if (!_app.isiOS) {
		  e.preventDefault();
		}
		template.$('#userfile').trigger('click');
		if (!_app.isiOS) {
		  return false;
		}
	},
	'change #userfile'(e, template) {
		if($('#submit').hasClass('disabled')){
			$('#submit').removeClass('disabled');
		}
		template.$('form#postform').submit();
	},
	'submit form#postform'(e, template) {
		e.preventDefault();
		template.error.set(false);
		template.initiateUpload(e, e.currentTarget.userfile.files);
		return false;
	},
	'dragover #postform, dragenter #postform'(e) {
		e.preventDefault();
		e.stopPropagation();
		const uf = document.getElementById('postform');
		if (!~uf.className.indexOf('file-over')) {
			uf.className += ' file-over';
		}
		e.originalEvent.dataTransfer.dropEffect = 'copy';
	},
	'drop #postform.file-over'(e, template) {
		e.preventDefault();
		e.stopPropagation();
		template.error.set(false);
		const uf = document.getElementById('postform');
		if (!!~uf.className.indexOf('file-over')) {
		  uf.className = uf.className.replace(' file-over', '');
		}
		e.originalEvent.dataTransfer.dropEffect = 'copy';
		template.initiateUpload(e, e.originalEvent.dataTransfer.files, template);
		return false;
	},

});
Template.postEditModal.helpers({
	contextConv: function () {
		var conver_text = this.context.replace(/<br \/\>/g, '\n');
		return conver_text;
	},
	uploadedFiles : function(){
		var ids = this.fileIds;
		for (var i = 0; i < ids.length; i++) {
			Blaze.renderWithData(Template.postFile, {itemId: ids[i]}, $("#upload-file")[0])

		}
	}
});
Template.postEditModal.onCreated(function() {
	this.delItems = [];
});
Template.postEditModal.events({
	'keydown #post_context_text': function (e, t) {
		if($('#update').hasClass('disabled')){
			$('#update').removeClass('disabled');
		}
		var value = $(e.target).val();
	    $('#post_context').html(value);
	},
	'click #update' : function (e, t) {
		var conver_text = $('#post_context').html().replace(/\n/g, "<br />");

		if(conver_text.trim() === ''){
			Modal.hide('postModal');
			return;
		}
		var post = {
			context : conver_text
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
	'click #file_remove':function(e, t){
	    e.preventDefault()
	    var itemId = e.currentTarget.dataset.value;
	    $(e.currentTarget).parents('.uploaded').remove();

	    t.delItems.push(itemId);

	    // remove image
	    // Collections.files.remove({_id: itemId}, function (error) {
	    //   if (error) {
	    //     console.error("File wasn't removed, error: " + error.reason)
	    //   } else {
	    //     console.info("File successfully removed");
	    //   }
	    // });
	  },
});

function urlify(text) {
    var urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    return text.replace(urlRegex, function(url) {
        return url;
    })
}