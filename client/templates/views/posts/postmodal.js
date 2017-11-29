import { Blaze } from 'meteor/blaze';
import { Template }          from 'meteor/templating';
import { ClientStorage }     from 'meteor/ostrio:cstorage';
import { _app, Collections } from '/lib/core.js';
import Images from '/collections/images.js';

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
	  Images.insert({
	    file: file,
	    meta: {
	      blamed: 0,
	      secured: secured,
	      expireAt: ttl,
	      unlisted: unlisted,
	      downloads: 0,
	      created_at: created_at - 1 - i
	    },
	    streams: 'dynamic',
	    chunkSize: 'dynamic',
	    transport: transport
	  }, false).on('end', function (error, fileObj) {
	  	console.log(fileObj);
	    if (!error) {
	    	Blaze.renderWithData(Template.postFile, {itemId: fileObj._id}, $(".in_block")[0])
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
});
Template.postModal.events({
	'keydown #post_context_text': function (e, t) {
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
		console.log('drop~~~~~~');
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