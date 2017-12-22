Template.postPage.helpers({
	postData: function () {
		console.log(this);
		return Posts.find();
		console.log(data);
	}
});