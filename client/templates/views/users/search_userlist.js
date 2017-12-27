
Template.searchUser.helpers({
	inputAttributes: function () {
		return { 'class': 'form-control', 'placeholder': '검색하려는 단어를 입력하세요. ', 'id' : 'search_user' };
	},
	index: function() {
		return MemberIndex;
	},
	resultsCount: function () {
		return MemberIndex.getComponentDict().get('count');
	},
	loadmoreClass : function(){
		return {'class'  : 'test'};
	},
});
Template.searchUser.onCreated(function() {
    var self = this;
    self.zoom = new ReactiveVar(0);
    $(window).on('scroll', function(e) {
    	if($('html,body')[0].scrollHeight - $('html,body').scrollTop() === $('html,body')[0].clientHeight) {
	        // getMoreItems();
	        $('.test').trigger('click');
	    }

    });
});

