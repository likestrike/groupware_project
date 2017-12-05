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

	var self = this;
	self.autorun(function () {
		self.subscribe('posts');
		var loopIndex = 0;
		console.log('autorun');
		Posts.find({}, {sort: {submitted: -1}, skip: 0, limit: inc_limit}).map(function(v, i) {
			v.index = i;
			if(loopIndex >= col_count){
				loopIndex = 0;
			}
			// console.log(col_count);
			Blaze.renderWithData(Template.postItem, {post : v}, $(".post-grid")[loopIndex]);
			// var InnerHtml = Blaze.toHTML(Blaze.With({post : v}, function() { return Template.postItem; }));
			// $(".post-grid:eq("+loopIndex+")").append(InnerHtml);
			loopIndex++;
		});
	});
	return;

	// get widow width
	this.remake = function(){
		console.log('remake');
		var test = Posts.find({}, {sort: {submitted: -1}}).map(function(v, i) {
	      	v.index = i;
	      	return v;
	    });
	    console.log(test);
		// var testhtml = $(".post-grid").find('#post-modal');
		var loopIndex = 0;
		// $(".post-grid").empty();
		// $("#post-write-area").append(testhtml);
		Posts.find({}, {sort: {submitted: -1}, skip: 0, limit: inc_limit}).map(function(v, i) {
			v.index = i;
			if(loopIndex >= col_count){
				loopIndex = 0;
			}
			// console.log(col_count);
			console.log(loopIndex);
			Blaze.renderWithData(Template.postItem, {post : v}, $(".post-grid")[loopIndex]);
			// var InnerHtml = Blaze.toHTML(Blaze.With({post : v}, function() { return Template.postItem; }));
			// $(".post-grid:eq("+loopIndex+")").append(InnerHtml);
			loopIndex++;
		});
	}
	var self = this;
	self.remake();
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
