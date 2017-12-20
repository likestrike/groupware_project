import { Blaze } from 'meteor/blaze';
import { Template }          from 'meteor/templating';
import { ClientStorage }     from 'meteor/ostrio:cstorage';
import { _app, Collections } from '/lib/core.js';
import Images from '/collections/images.js';

var screenSizes = {
  xs: 480,
  sm: 768,
  md: 992,
  lg: 1200
};

Template.postEditModal.onCreated(function() {
	const self          = this;
	this.error          = new ReactiveVar(false);
	this.uploadQTY      = 0;
	this.showSettings   = new ReactiveVar(false);
	this.delItems       = [];
	this.addItems       = [];
	this.uploadedItmes  = [];


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
	    	Blaze.renderWithData(Template.postFile, {itemId: fileObj._id}, $("#upload-file")[0]);
	    	self.addItems.push(fileObj._id);
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

Template.postEditModal.helpers({
	contextConv: function () {
		var conver_text = this.context.replace(/<br \/\>/g, '\n');
		return conver_text;
	},
	uploadedFiles : function(){
		var ids = this.fileIds;
		for (var i = 0; i < ids.length; i++) {
			console.log(ids[i]);
			Blaze.renderWithData(Template.postFile, {itemId: ids[i]}, $("#upload-file")[0])
		}
	},
	getFileIds : function(){
		console.log('get');
		return this.fileIds;
	}
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
		e.preventDefault();
		e.stopPropagation();
		var conver_text = $('#post_context').html().replace(/\n/g, "<br />");

		if(conver_text.trim() === ''){
			Modal.hide('postModal');
			return;
		}

		// get add image ids
		var uploadedItems = this.fileIds;
		var file_ids = t.addItems;
		var dell_ids = t.delItems;

		var newItems = $.merge(uploadedItems, file_ids);
		newItems = $(newItems).not(dell_ids).get();

		if(dell_ids.length > 0){
			Collections.files.remove({_id: {"$in": dell_ids}}, function (error) {
		      if (error) {
		        console.error("File wasn't removed, error: " + error.reason)
		      } else {
		        console.info("File successfully removed");
		      }
		    });
		}

		var post = {
			context : conver_text,
			fileIds : newItems
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
	    console.log(t.delItems);

	    // remove image
	    // Collections.files.remove({_id: itemId}, function (error) {
	    //   if (error) {
	    //     console.error("File wasn't removed, error: " + error.reason)
	    //   } else {
	    //     console.info("File successfully removed");
	    //   }
	    // });
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

function urlify(text) {
    var urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    return text.replace(urlRegex, function(url) {
        return url;
    })
}