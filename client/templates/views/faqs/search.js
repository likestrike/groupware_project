Template.search.helpers({
	inputAttributes: function () {
		return { 'class': 'easy-search-input', 'placeholder': 'Start searching...' };
	},
	index: function() {
		return FaqsIndex;
	},
	resultsCount: function () {
		return FaqsIndex.getComponentDict().get('count');
	},
});
