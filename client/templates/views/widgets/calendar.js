/*Template.calendarWidget.helpers({
    options: function() {
        return {
            // defaultView: 'agendaWeek',
			header: {
				left: 'prev,next today',
				center: 'title',
				right: 'month,agendaWeek,agendaDay'
			},
			events: [
				{
					title: 'Event1',
					start: '2017-10-10'
				},
				{
					title: 'Event2',
					start: '2017-10-11'
				}
				// etc...
			],
            dayClick: function() {
		        // alert('a day has been clicked!');
		        Modal.show('calendarEvent');
		    }
        };
    }
});*/
Template.calendarWidget.rendered = function () {
	Meteor.subscribe('meeting_times');
    $('#calendar').fullCalendar({

        events: function (start, end, timezone, callback) {
            var events = [];
            calEvents = MeetingTimes.find();
            console.log(calEvents.count());
            if(calEvents.count() > 0){
            	calEvents.forEach(function (evt) {
            		console.log(evt.title);
	                events.push({
	                    id: evt._id,
	                    title: evt.title,
	                    start: evt.start
	                });
	            });
            }
            //alert(events.length);
            callback(events);
        },
        dayClick: function(date, jsEvent, view){
        	var date_val = moment(date).format("YYYY-MM-DD");
            // MeetingTimes.insert({title:'NEW', start:date_val, end:date_val});
            var meetTimes = {title:'NEW', start:date_val, end:date_val}
			Meteor.call('meetingTimeInsert', meetTimes, function(error, result) {
				// display the error to the user and abort
				if (error)
				return Bert.alert(error.reason);

				Session.set('lastMod', new Date());
            	updateCalendar();
			});
            
        },
        eventClick: function (calEvent, jsEvent, view) {

        }

    });

    // Tracker.autorun(function(){
        
    // });
};


var updateCalendar = function(){
    $('#calendar').fullCalendar( 'refetchEvents' );
}
