Template.searchUser.helpers({
	inputAttributes: function () {
		return { 'class': 'form-control', 'placeholder': '검색하려는 단어를 입력하세요. ', 'id' : 'search_faq' };
	},
	index: function() {
		return MemberIndex;
	},
	resultsCount: function () {
		return MemberIndex.getComponentDict().get('count');
	},
});


