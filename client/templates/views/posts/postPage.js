Template.postPage.helpers({
	getWidth:function(){
		return Session.get('window_width');
	},
	getHeight:function(){
		return Session.get('window_height');
	},
	postData: function () {
		console.log(this);
		return Posts.find();
		console.log(data);
	}
});

Template.blindpage.helpers({
	getWidth:function(){
		return Session.get('window_width');
	},
	getHeight:function(){
		return Session.get('window_height');
	},
	BlindData: function () {
		return Blinds.find();
	}
});
