Template.blindItem.helpers({
	formattedDate: function(){
		moment.locale('ko');
		return moment(this.submitted).format("LLL");
	},
	comments: function() {
		Meteor.subscribe('blind_comments', this._id);
	    // return Comments.find({postId: this._id}, {sort: {submitted: -1}, limit: 2});
	    return BlindComments.find({blindId: this._id});
	},
	ownPost: function(){
		var loggedInUser = Meteor.user();
		if(loggedInUser){
			if (Roles.userIsInRole(loggedInUser, ['admin'], 'default-group')){
		  		return true;
			}
		}
		return this.userId === Meteor.userId();
	},
	getdata: function(){
  		return this.fileIds;
  	},
});

Template.blindItem.events({
	'submit form': function (e, t) {
		e.preventDefault();

		var $body = $(e.target).find('#comment');
	    var comment = {
	      body: $body.html(),
	      blindId: this._id
	    };
	    Meteor.call('blind_commentInsert', comment, function(error, commentId) {
	      if (error){
	        throwError(error.reason);
	      } else {
	        $body.empty();
	      }
	    });
	},

	'click #edit_blind':function(e, t){
		e.preventDefault()
		var itemId = this._id;
		Modal.show('blindEditModal', function () {
			return Blinds.findOne(itemId);
		});
		// Modal.show('postEditModal');
	},
	'click #delete_blind':function(e, t){
		e.preventDefault()
		var currentPostId = this._id;
		var myalert = new MyAlert();
		var callback = {
			fn: function() {
				Blinds.remove(currentPostId);
	      		FlowRouter.go('/blindlist');
			}
		}
		myalert.deleteConfirm(callback);
	},

	'keydown #comment': function (e, t) {
		var $body = $(e.currentTarget);
		var $summit = $body.next().find('#comment_submit');;
		if($body.text().trim() === ''){
			if(!$summit.hasClass('disabled')){
				$summit.addClass('disabled');
			}
			return;
		}
		if($summit.hasClass('disabled')){
			$summit.removeClass('disabled');
		}
	},
	'click #comment_submit': function (e, t) {
		e.preventDefault();
		e.stopPropagation();

		var $target = $(e.currentTarget);

		var $form = $target.parents('#commentform');
		var $wrapper = $target.parents('.box-footer').prev();
		var $footer = $target.parents('.box-footer');
		var $body = $form.find('#comment');
		var $uploaded = $form.find('.comment_uploaded_image');
		if($body.text().trim() === '' && $('.comment_uploaded_image').length == 0){
			return;
		}
		var fileId = '';
		if($uploaded.length >0){
			var fileId = $uploaded.data('value');
		}

	    var comment = {
	      body: $body.html(),
	      blindId: this._id,
	      fileId: fileId,
	    };
	    Meteor.call('blind_commentInsert', comment, function(error, commentId) {
	      if (error){
	        throwError(error.reason);
	      } else {
	        $body.empty();
	        $form.find('#comment-upload-file').empty();
	        $target.addClass('disabled');
	        $wrapper.animate({scrollTop : $footer.offset().top}, 0);
	      }
	    });

	},
	'click #commentUpload'(e, template) {
		if (!_app.isiOS) {
		  e.preventDefault();
		}
		template.$('#commentfile').trigger('click');
		if (!_app.isiOS) {
		  return false;
		}
	},
	'change #commentfile'(e, template) {
		template.$('form#commentform').submit();
	},
	'submit form#commentform'(e, template) {
		e.preventDefault();
		// template.error.set(false);
		$(e.currentTarget);
		template.initiateUpload(e, e.currentTarget.commentfile.files, $(e.currentTarget));
		return false;
	},


});

Template.blindItem.onCreated(function(){
	var self = this;

	this.initiateUpload = (event, files, formTarget) => {
		const self          = this;
		this.error          = new ReactiveVar(false);
		this.uploadQTY      = 0;
		this.showSettings   = new ReactiveVar(false);

		_app.blamed   = new ReactiveVar(ClientStorage.get('blamed'));
		_app.unlist   = new ReactiveVar(ClientStorage.get('unlist'));
		_app.secured  = new ReactiveVar(ClientStorage.get('secured'));
		_app.uploads  = new ReactiveVar(false);

		if (_app.uploads.get()) {
		  return false;
		}
		if (!files.length) {
		  this.error.set('Please select a file to upload');
		  return false;
		}
		if (files.length > 1) {
		  this.error.set('Please select up to 1 files');
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
		      category : 'post',
		      created_at: created_at - 1 - i
		    },
		    streams: 'dynamic',
		    chunkSize: 'dynamic',
		    transport: transport
		  }, false).on('end', function (error, fileObj) {
		    if (!error) {
		    	Blaze.renderWithData(Template.commentFile, {itemId: fileObj._id}, formTarget.find("#comment-upload-file")[0])
		    	formTarget.find('#commentUpload').hide();
		    	formTarget.find('#comment_submit').removeClass('disabled');
		    	formTarget.addClass('uploaded');
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
	};


});




