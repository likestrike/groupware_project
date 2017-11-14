import Images from '/collections/images.js';


Template.fileview.events({
  'click #file_remove':function(e, t){
    e.preventDefault()
    var itemId = this._id;
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