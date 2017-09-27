Template.blindModal.events({

});
var blidHook = {
  onSubmit: function(insertDoc, updateDoc, currentDoc) {
  	console.log('dddd');
  	Modal.hide('blindModal');
	FlowRouter.go('/blindlist');
  },
  after: {
    // Replace `formType` with the form `type` attribute to which this hook applies
    insert: function(error, result) {
    	Modal.hide('blindModal');
		FlowRouter.go('/blindlist');	
    }
  },
  endSubmit: function() {
  	Modal.hide('blindModal');
	FlowRouter.go('/blindlist');
  }

}

AutoForm.addHooks('insertBlindForm', blidHook);