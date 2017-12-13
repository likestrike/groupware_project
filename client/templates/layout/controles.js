import { ClientStorage }     from 'meteor/ostrio:cstorage';
Template.controles.events({
	'click [data-skin]': function (e, t) {
		e.preventDefault()
		changeSkin($(e.target).data('skin'))
	}
});
function changeSkin(cls) {
	// $.each(mySkins, function (i) {
 //  		$('body').removeClass(mySkins[i])
	// })
	$('#layout-main').removeClass('skin-red');
	$('#layout-main').addClass('skin-blue')
	ClientStorage.set('skin', 'blue');

	// store('skin', cls)
	return false
}