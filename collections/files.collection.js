import { _app, Collections } from '/lib/core.js';
import { FilesCollection }   from 'meteor/ostrio:files';

Collections.files = new FilesCollection({
  // debug: true,
  storagePath : 'D:/contents',
  collectionName: 'uploadedFiles',
  allowClientCode: true,
  // disableUpload: true,
  // disableDownload: true,
  protected(fileObj) {
    if (fileObj) {
      if (!(fileObj.meta && fileObj.meta.secured)) {
        return true;
      } else if ((fileObj.meta && fileObj.meta.secured === true) && this.userId === fileObj.userId) {
        return true;
      }
    }
    return false;
  },
  onBeforeRemove(cursor) {
    const res = cursor.map((file) => {
      if (file && file.userId && _.isString(file.userId)) {
        return file.userId === this.userId;
      }
      return false;
    });
    return !~res.indexOf(false);
  },
  onBeforeUpload() {
    if (this.file.size <= 1024 * 1024 * 128) {
      return true;
    }
    return "125MB 까지만 올릴 수 있습니다. " + (filesize(this.file.size));
  },
  downloadCallback(fileObj) {
    if (this.params && this.params.query && this.params.query.download === 'true') {
      Collections.files.collection.update(fileObj._id, {
        $inc: {
          'meta.downloads': 1
        }
      }, _app.NOOP);
    }
    return true;
  },
});

if (Meteor.isServer) {
  Collections.files.allowClient();
  Collections.files.denyClient();
  Collections.files.on('afterUpload', function(_fileRef) {

    if (/png|jpe?g/i.test(_fileRef.extension || '')) {
      Meteor.setTimeout( () => {
        _app.createThumbnails(this, _fileRef, (error) => {
          if (error) {
            console.error(error);
          }
        });
      }, 1024);
    }
  });
  Meteor.publish('files.images.all', function () {
    return Collections.files.find().cursor;
  });
}else{
  Meteor.subscribe('files.images.all');
}
// Collections.files.denyClient();

// Remove all files on server load/reload, useful while testing/development
// Meteor.startup -> Collections.files.remove {}

// Remove files along with MongoDB records two minutes before expiration date
// If we have 'expireAfterSeconds' index on 'meta.expireAt' field,
// it won't remove files themselves.
Meteor.setInterval(() => {
  Collections.files.remove({
    'meta.expireAt': {
      $lte: new Date(+new Date() + 120000)
    }
  }, _app.NOOP);
}, 120000);