import { Index, MinimongoEngine } from 'meteor/easy:search'
Members = Meteor.users;
// On Client and Server
MemberIndex = new Index({
  sort: function () {
    return { 'profile.fullname' : 0 };
  },
  collection: Members,
  fields: ['profile.fullname', 'profile.orgPath'],
  engine: new MinimongoEngine(),
  defaultSearchOptions: { limit: 16 },
})
Meteor.users.allow({
  update: function(userId, user) {
    return true; 
  }
});

 Meteor.methods({
  'updateUser': function(id,attributes){
    var loggedInUser = Meteor.user();
    console.log(attributes);
    console.log(id);
    console.log(loggedInUser);
    if (!loggedInUser ||!Roles.userIsInRole(loggedInUser, ['admin'], 'default-group')) {throw new Meteor.Error(403, "Access denied");}
    console.log(attributes);
    var profilo = {
      'fullname': attributes.profile.fullname
    };
    Meteor.users.update(id,{$set:{"profile":profilo}});
    // if(password){
      // Accounts.setPassword(id, password);
    // }
  },
  'get_users_by_email': function(email) {
      check(email, String);
      console.log(email);
      console.log(Meteor.users.find().count());
      console.log(Meteor.users.find({_id : 'wjZM9ZbDri5Wq87K4'}).count());
      console.log(Meteor.users.find({_id : 'wjZM9ZbDri5Wq87K4'}).count());
      console.log(Meteor.users.find({ 'emails.address': email }).count());
      return Meteor.users.find({ 'emails.address': email }).fetch();
  },
});