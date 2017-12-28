import { Blaze } from 'meteor/blaze'

Template.tagviewer.helpers({
	tag : function () {
		return this.tag;
	},
	bigsize : function(){
		if(this.width > 300){
			return true;
		}else{
			return false;
		}
	}
});
Template.tagviewer.onCreated(function(){
	var test = this.tag;
});

Template.tagviewer.events({
	'click #tag_remove':function(e, t){
		var id = $(e.currentTarget).data('value');
		Ogtags.remove(id);
		Blaze.remove(Blaze.currentView);
	}
});

Template.postTagView.helpers({
	tag : function () {
		Meteor.subscribe('ogtags');
		var id = Template.instance().data;
		if(id == undefined ){
  			return false;
  		}
		return Ogtags.findOne({'_id' : id});
	},
	bigsize : function(){
		if(this.width > 300){
			return true;
		}else{
			return false;
		}
	}
});
Template.postTagView.events({
	'click #tagYoutube': function (e, t) {
		var $target = $(e.currentTarget).parent();
		var data = Ogtags.findOne({'_id' : this._id});
		var youtubeId = data.YoutubeId;
		// var url  = 'www.youtube.com/embed/'+youtubeId+'?autoplay=1';
		var key =youtubeId;
		// $target.append('<iframe frameborder="0" class="tag-youtube-iframe" src="'+url+'" allowfullscreen=""></iframe>');
		Blaze.renderWithData(Template.tagYoutube, {url: key}, $target[0])
	}
});
Template.tagYoutube.helpers({
	url: function () {
		return Blaze.getData().url;
	}
});
Template.tagYoutube.onCreated(function(){
	var url = Blaze.getData().url;
	onYouTubeIframeAPIReady = function () {

        // New Video Player, the first argument is the id of the div.
        // Make sure it's a global variable.
        player = new YT.Player("player", {

            class : "tag-youtube-iframe",

            // videoId is the "v" in URL (ex: http://www.youtube.com/watch?v=LdH1hSWGFGU, videoId = "LdH1hSWGFGU")
            videoId: url, 

            // Events like ready, state change, 
            events: {

                onReady: function (event) {

                    // Play video when player ready.
                    event.target.playVideo();
                }

            }

        });

    };

    YT.load();
})