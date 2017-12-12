import { _app, Collections } from '/lib/core.js';
import Images from '/collections/images.js';


Template.uploadedFiles.helpers({
  uploadedFiles: function () {
    return Images.find();
  }
});
Template.uploadedFiles.events({
  'click #file_remove':function(e, t){
    e.preventDefault()
    var itemId = e.currentTarget.dataset.value;

    // remove image
    Images.remove({_id: itemId}, function (error) {
      if (error) {
        console.error("File wasn't removed, error: " + error.reason)
      } else {
        console.info("File successfully removed");
      }
    });
  },
});

Template.postFile.helpers({
  fileObj : function () {
    console.log(this.itemId);
    return Collections.files.findOne(this.itemId);
  }
});

Template.postFile.events({
  'click #file_remove':function(e, t){
    e.preventDefault()
    var itemId = e.currentTarget.dataset.value;

    // remove image
    Collections.files.remove({_id: itemId}, function (error) {
      if (error) {
        console.error("File wasn't removed, error: " + error.reason)
      } else {
        console.info("File successfully removed");
      }
    });
  },
});


Template.uploadForm.onCreated(function () {
  this.currentUpload = new ReactiveVar(false);
});

Template.uploadForm.helpers({
  currentUpload: function () {
    return Template.instance().currentUpload.get();
  }
});

Template.uploadForm.events({
  'change #fileInput': function (e, template) {
    if (e.currentTarget.files && e.currentTarget.files[0]) {
      // We upload only one file, in case
      // there was multiple files selected
      var file = e.currentTarget.files[0];
      if (file) {
        var uploadInstance = Images.insert({
          file: file,
          streams: 'dynamic',
          chunkSize: 'dynamic'
        }, false);

        uploadInstance.on('start', function() {
          template.currentUpload.set(this);
        });

        uploadInstance.on('end', function(error, fileObj) {
          if (error) {
            // window.alert('Error during upload: ' + error.reason);
            console.log('Error during upload: ' + error.reason);
          } else {
            // window.alert('File "' + fileObj.name + '" successfully uploaded');
            console.log('File "' + fileObj.name + '" successfully uploaded');
          }
          template.currentUpload.set(false);
        });

        uploadInstance.start();
      }
    }
  },

});
