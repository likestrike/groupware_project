Template.notice.onCreated(function() {

});

Template.notice.helpers({
	notiattr: function () {
		var attributes = {};
		var data = false;
		if(data){
			attributes.class="notice-wrapper slideInDown animated";
			attributes.style="display : block;";
		}else{
			attributes.class="notice-wrapper"
		}
		return attributes;
	}
});	