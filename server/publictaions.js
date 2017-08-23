
Meteor.publish("user", function () {
	return Meteor.users.find();
});
Meteor.publish("userlist", function (limit) {
	check(limit, Number);
	return Meteor.users.find({limit : limit});
});

