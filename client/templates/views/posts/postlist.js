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
	clear:function(){
		$(".post-grid").empty();
	},
	seperate: function(){
		var loopIndex = 0;
		$(".post-grid").find('.box').remove();
		for (var i = 1; i < col_count; i++) {
			var test = $('<div class="post-grid addnew col-md-4"></div>');
			$('#post-row').append(test);
		}
		Posts.find({}, {sort: {submitted: -1}, limit: default_limit}).map(function(v, i) {
			v.index = i;
			if(loopIndex >= col_count){
				loopIndex = 0;
			}
			Blaze.renderWithData(Template.postItem, {post : v}, $(".post-grid")[loopIndex]);
			loopIndex++;
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
	// get widow width
	var window_width = $(window).width();
	console.log(window_width);
	//  set col div count
	if(window_width <= 1420){
		col_count = 2;
	}else if(window_width <= 990){
		col_count = 1;
	}
	console.log($('#post-row'))


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
		var testhtml = $(".post-grid").find('#post-modal');
		$(".post-grid").empty;
		$("#post-write-area").append(testhtml);
		Posts.find({}, {sort: {submitted: -1}, skip: 0, limit: inc_limit}).map(function(v, i) {
			var loopIndex = 0;
			v.index = i;
			if(loopIndex >= col_count){
				loopIndex = 0;
			}
			// Blaze.renderWithData(Template.postItem, {post : v}, $(".post-grid")[loopIndex]);

			var InnerHtml = Blaze.toHTML(Blaze.With({post : v}, function() { return Template.postItem; }));
			if(loopIndex == 0){
				$(".post-grid:eq("+loopIndex+")").append( InnerHtml);
			}else{
				$(".post-grid:eq("+loopIndex+")").append(InnerHtml);
			}


		});
	}
	var self = this;
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
		if($(this).width() <= 1420){
			$('.post-grid.addnew').remove();
			if(col_count !== 2){
				col_count = 2;
				for (var i = 1; i < col_count; i++) {
					var test = $('<div class="post-grid addnew col-md-6"></div>');
					$('#post-row').append(test);
				}
				$(".post-grid").removeClass('col-md-4').addClass('col-md-6');
				self.remake();
			}

			// if(viewIndex !== 2){
			// 	viewIndex = 2;

			// }
		}else if($(this).width() > 1420){
			if(viewIndex !== 3){
				viewIndex = 3;
				// self.remake();
			}
		}else{
			if(viewIndex !== 1){
				viewIndex = 1;
				$(".post-grid").removeClass('col-md-6').addClass('col-md-12');
				// self.remake();
			}
		}
	});
})
