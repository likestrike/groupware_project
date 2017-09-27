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
  }
});