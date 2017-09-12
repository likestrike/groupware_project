
Meteor.publish("user", function () {
	return Meteor.users.find();
});
Meteor.publish("userlist", function (limit) {
	check(limit, Number);
	return Meteor.users.find({limit : limit});
});
// Give authorized users access to sensitive data by group
Meteor.publish('secrets', function (group) {
  if (Roles.userIsInRole(this.userId, ['view-secrets','admin'], group)) {

    return Meteor.secrets.find({group: group});

  } else {

    // user not authorized. do not publish secrets
    this.stop();
    return;

  }
});
Accounts.removeDefaultRateLimit();
Accounts.onCreateUser(function(options, user){

    var newEmail = user.emails[0].address

    console.log(newEmail)

    var emailAlreadyExist = Meteor.users.find({"emails.address": newEmail}, {limit: 1}).count()>0;

    console.log(emailAlreadyExist + ' already exists')
    if(emailAlreadyExist === true) {
        throw new Meteor.Error(403, "email already registered");
    }
    else {

        profile = options.profile

        profile.nameOfArray =[]


        user.profile = profile

        return user
    }
});
