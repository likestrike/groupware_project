const Images = new FilesCollection({
  debug: true,
  collectionName: 'Images',
  storagePath : 'D:/contents',
  allowClientCode: true, // Disallow remove files from Client
  onBeforeUpload: function (file) {
    // Allow upload files under 10MB, and only in png/jpg/jpeg formats
    if (file.size <= 1024 * 1024 * 10 && /png|jpe?g/i.test(file.extension)) {
      return true;
    }
    return 'Please upload image, with size equal or less than 10MB';
  },

});
// Images.collection.attachSchema(new SimpleSchema(Images.schema));


if (Meteor.isServer) {
  Images.allowClient();
  Images.denyClient();
  Meteor.publish('files.images.all', function () {
    return Images.find().cursor;
  });
} else {
  Meteor.subscribe('files.images.all');
}

export default Images;
