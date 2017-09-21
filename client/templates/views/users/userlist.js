Template.userlist.helpers({
  users: function(){
    return Meteor.users.find({},{sort : {username : -1}});
    // return Meteor.users.find();
    // {sort : {submitted : -1}}
  },
});
