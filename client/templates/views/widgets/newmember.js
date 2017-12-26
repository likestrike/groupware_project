Template.newMembers.helpers({
	currenMonth : function(){
		var date = new Date();
		return (date.getMonth()+1);
	},
	recent: function () {
		Meteor.subscribe('userAll');

		var date = new Date();
		
		var getFirstDay = new Date(date.getFullYear(), date.getMonth(), 1);
		var getLastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);


		var firstDay = getFirstDay.getFullYear() + '-' + ((''+getFirstDay.getMonth()).length<2 ? '0' : '') + (getFirstDay.getMonth()+1) + '-' + ((''+getFirstDay.getDate()).length<2 ? '0' : '') + getFirstDay.getDate()+"T00:00:00.000Z";
		var lastDay = getLastDay.getFullYear() + '-' + ((''+getLastDay.getMonth()).length<2 ? '0' : '') + (getLastDay.getMonth()+1) + '-' + ((''+getLastDay.getDate()).length<2 ? '0' : '') + getLastDay.getDate()+"T00:00:00.000Z";

		console.log(firstDay);
		console.log(lastDay);

		var data = Meteor.users.find({'creationTime' : {$gt : new Date(firstDay), $lt : new Date(lastDay)}});
		console.log(data);
		return Meteor.users.find({'creationTime' : {$gt : new Date(firstDay), $lt : new Date(lastDay)}});
		
	},
	formattedDate: function(){
    	moment.locale('ko');
	    return moment(this.creationTime).from(moment(new Date() ));
	  },
});