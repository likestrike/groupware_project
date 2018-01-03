locmanNoti = new Mongo.Collection('locmanNoti');

locmanNoti.allow({
  update: function () { return true; },
  remove: function () { return true; }
});
// locmanNoti.deny({
//   update: function(userId, doc, fieldNames) {
//     return true;
//   },
//   remove : function(){
//     return true;
//   }
// });

Meteor.methods({
  locman_notiInsert: function(Attribute) {

    // check(this.userId, String);
    check(Attribute, Object);

    // var user = Meteor.userId();
    var data = _.extend(Attribute, {
      submitted: new Date(),
      sent : false
    });

    var meetId = locmanNoti.insert(data);

    return {
      _id: meetId
    };
  }
});