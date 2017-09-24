Template.search.helpers({
	inputAttributes: function () {
		return { 'class': 'form-control', 'placeholder': '검색하려는 단어를 입력하세요. ' };
	},
	index: function() {
		return FaqsIndex;
	},
	resultsCount: function () {
		return FaqsIndex.getComponentDict().get('count');
	},
});
