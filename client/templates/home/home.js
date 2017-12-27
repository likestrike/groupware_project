import {PieChart} from "meteor/nodexpert:d3piechart";

Template.home.helpers({
	getWidth:function(){
		return Session.get('window_width');
	},
	getHeight:function(){
		return Session.get('window_height');
	},
	postcount: function () {
		Meteor.subscribe('posts');
		return Posts.find().count();
	},
	usercount: function () {
		Meteor.subscribe('userAll');
		return Meteor.users.find().count();
	},
	blindcount: function () {
		Meteor.subscribe('blinds');
		return Blinds.find().count();
	},
	faqcount: function () {
		Meteor.subscribe('faqs');
		return Faqs.find().count();
	}
});

Template.home.onCreated(function(){
	console.log('created');
	
	const data = [
                   {
                      "type":"organic",
                      "qty":45
                   },
                   {
                      "type":"ads",
                      "qty":30
                   },
                   {
                      "type":"info",
                      "qty":20
                   },
                   {
                      "type":"maps",
                      "qty":50
                   },
                   {
                      "type":"images",
                      "qty":10
                   }
                ];
    const objPieChart = new PieChart();
    objPieChart.setPieChartElement(".chart-responsive"); 
    objPieChart.setData(data); 
    objPieChart.setHeight(300); 
    objPieChart.setAnimationDuration(300);
    objPieChart.createPieChart(); 
});