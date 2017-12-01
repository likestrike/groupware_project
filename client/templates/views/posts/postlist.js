import { Blaze } from 'meteor/blaze';
var targetIndex = 0;
var viewIndex = 3;
var inc_limit = 17;

Template.postlist.helpers({
	postData: function() {
		return Posts.find({}, {sort: {submitted: -1}}).map(function(v, i) {
	      	v.index = i;
			return v;
	    });
	}, 
	clear:function(){
		$(".post-grid").empty();
	},
	seperate: function(){
		$(".post-grid").find('.box').empty();
		Posts.find({}, {sort: {submitted: -1}, limit: inc_limit}).map(function(v, i) {
			v.index = i;
			var index = i;
			targetIndex++;
			if(targetIndex >= viewIndex){
				targetIndex = 0;
			}
			console.log(targetIndex);
			Blaze.renderWithData(Template.postItem, {post : v}, $(".post-grid")[targetIndex])
		});
	}
});
Template.postlist.events({
	'click #post-modal': function (e, t) {
		e.preventDefault()
		// var options = {backdrop: 'static', keyboard: false};
		Modal.show('postModal');
	},
});
Template.postlist.onCreated(function(){
	this.test = function(){
		// $(".post-grid").find('.box').empty();
		Posts.find({}, {sort: {submitted: -1}, skip: inc_limit, limit: 12}).map(function(v, i) {
			v.index = i;
			inc_limit = inc_limit + 12;
			targetIndex++;
			if(targetIndex == viewIndex){
				targetIndex = 0;
			}

			Blaze.renderWithData(Template.postItem, {post : v}, $(".post-grid")[targetIndex])
		});	
	}
	this.remake = function(){
		$(".post-grid").find('.box').empty();
		Posts.find({}, {sort: {submitted: -1}, skip: inc_limit, limit: 12}).map(function(v, i) {
			v.index = i;
			var index = i;
			var result = (index%viewIndex);
			targetIndex++;
			if(result == 0){
				targetIndex = 0;
			}
			Blaze.renderWithData(Template.postItem, {post : v}, $(".post-grid")[targetIndex])
		});	
	}
	var self = this;
	$(window).on('scroll', function(){
		if($('html, body')[0].scrollHeight - $('html, body').scrollTop() === $('html, body')[0].clientHeight){
			self.test();
		}
	});
	$(window).resize(function() {
		if($(this).width() <= 1420){
			if(viewIndex !== 2){
				viewIndex = 2;
				$(".post-grid").removeClass('col-md-4').addClass('col-md-6');
				self.remake();
			}
		}else if($(this).width() > 1420){
			if(viewIndex !== 3){
				viewIndex = 3;
				self.remake();
			}
		}else{
			if(viewIndex !== 1){
				viewIndex = 1;
				$(".post-grid").removeClass('col-md-6').addClass('col-md-12');
				self.remake();
			}
		}
	});
})
