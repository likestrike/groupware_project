Ogtags = new Mongo.Collection('ogtags');

Ogtags.allow({
  remove : function(){
    return true;
  }
})
Ogtags.deny({
  update: function(userId, doc, fieldNames) {
    return _.contains(fieldNames, 'userId');
  },
  remove : function(){
    return false;
  }
});

Meteor.methods({
  ogtagInsert : function(attr){
    check(attr, Object);

    var tagId = Ogtags.insert(attr);
    return {
      _id: tagId
    };
  }
});
