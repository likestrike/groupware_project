import Images from '/collections/images.js';


Template.fileview.events({
  'click #file_remove':function(e, t){
    console.log('remove click');
    e.preventDefault()
    var itemId = this._id;
    console.log(itemId);

    // remove image
    // Images.findOne({_id: itemId}).remove({});
    Images.remove({_id: itemId}, function (error) {
	  if (error) {
	    console.error("File wasn't removed, error: " + error.reason)
	  } else {
	    console.info("File successfully removed");
	  }
	});
    // Modal.show('postEditModal');
  },
});