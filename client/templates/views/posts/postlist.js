import { Blaze } from 'meteor/blaze';
var viewIndex = 3;
var default_limit = 16;
var inc_limit = 16; // increase limit : default
var col_count = 3;

Template.postlist.helpers({
	postData: function() {
		return Posts.find({}, {sort: {submitted: -1}}).map(function(v, i) {
	      	v.index = i;
	      	return v;
	    });
	},

});
Template.postlist.events({
	'click #post-modal': function (e, t) {
		e.preventDefault()
		// var options = {backdrop: 'static', keyboard: false};
		Modal.show('postModal');
	},
});
Template.postlist.onCreated(function(){
	$(window).on('scroll', function(){
		if($('html, body')[0].scrollHeight - $('html, body').scrollTop() === $('html, body')[0].clientHeight){
			var postcount = Posts.find().count();
			if(postcount > default_limit){
				console.log('get next post data');
				// self.test();
			}
		}
	});
	$(window).resize(function() {
		if($(this).width() >= 990 && $(this).width() <= 1420){

		}else if($(this).width() > 1420){

		}else if($(this).width() < 991){

		}
	});
})
