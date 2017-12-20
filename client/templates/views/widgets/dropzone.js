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
	  Collections.files.insert({
	    file: file,
	    meta: {
	      blamed: 0,
	      secured: secured,
	      expireAt: ttl,
	      unlisted: unlisted,
	      downloads: 0,
	      category : 'temp',
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
Template.dropzone.events({
	'dragover dropzone-area, dragenter dropzone-area'(e) {
		e.preventDefault();
		e.stopPropagation();
		const uf = document.getElementById('postform');
		if (!~uf.className.indexOf('file-over')) {
			uf.className += ' file-over';
		}
		e.originalEvent.dataTransfer.dropEffect = 'copy';
	},
	'drop dropzone-area.file-over'(e, template) {
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