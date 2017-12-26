import { Blaze } from 'meteor/blaze';
import { Template }          from 'meteor/templating';
import { ClientStorage }     from 'meteor/ostrio:cstorage';
import { _app, Collections } from '/lib/core.js';
import { filesize }          from 'meteor/mrt:filesize';
import Images from '/collections/images.js';

Template.blindModal.onCreated(function(){
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
	      category : 'blind',
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
Template.blindModal.helpers({
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
Template.blindModal.events({
	'keydown #blind_context_text': function (e, t) {
		if($('#update').hasClass('disabled')){
			$('#update').removeClass('disabled');
		}
		var value = $(e.target).val();
	    $('#blind_context').html(value);
	},
	'keyup #blind_context_text': function (e, t) {
		var value = $(e.target).val();
	    $('#blind_context').html(value);
	    $('.blind-form-area').css({
	    	height : $('#blind_context').height() + 'px'
	    })
		if (e.keyCode !== 13) return;
	},
	'click #submit' : function (e, t) {
		var conver_text = $('#blind_context').html().replace(/\n/g, "<br />");

		if(conver_text.trim() === ''){
			Modal.hide('blindModal');
			return;
		}
		// get image ids
		var file_ids = [];
		if($('.post_uploaded_image').length >0){
			$('.post_uploaded_image').each(function(){
				file_ids.push($(this).data('value'));
			});
		}
		if($('.file-preview').length > 0){
			$('.file-preview').each(function(){
				file_ids.push($(this).data('value'));
			});
		}

		var post = {
			context : conver_text,
			fileIds : file_ids
		}
		Meteor.call('blindInsert', post, function(error, result) {
	      // display the error to the user and abort
	      if (error)
	        return Bert.alert(error.reason);

	    	Modal.hide('blindModal');
	      // Router.go('postPage', {_id: result._id});
	        FlowRouter.go('/blindlist');
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
		template.$('form#blindform').submit();
	},
	'submit form#blindform'(e, template) {
		e.preventDefault();
		template.error.set(false);
		template.initiateUpload(e, e.currentTarget.userfile.files);
		return false;
	},
	'dragover #blindform, dragenter #blindform'(e) {
		e.preventDefault();
		e.stopPropagation();
		const uf = document.getElementById('blindform');
		if (!~uf.className.indexOf('file-over')) {
			uf.className += ' file-over';
		}
		e.originalEvent.dataTransfer.dropEffect = 'copy';
	},
	'dragleave #fileuploadArea'(e){
		e.preventDefault();
		e.stopPropagation();
		if($('#blindform').hasClass('file-over')){
			$('#blindform').removeClass('file-over');
		}
	},
	'drop #blindform.file-over'(e, template) {
		e.preventDefault();
		e.stopPropagation();
		template.error.set(false);
		const uf = document.getElementById('blindform');
		if (!!~uf.className.indexOf('file-over')) {
		  uf.className = uf.className.replace(' file-over', '');
		}
		e.originalEvent.dataTransfer.dropEffect = 'copy';
		template.initiateUpload(e, e.originalEvent.dataTransfer.files, template);
		return false;
	},
});