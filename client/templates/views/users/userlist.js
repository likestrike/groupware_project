Template.userlist.helpers({
  users: function(){
    return Meteor.users.find({},{sort : {username : -1}}).fetch();
    // {sort : {submitted : -1}}
  },
});
