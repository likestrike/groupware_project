//routing as home page (/), rendering layout template
FlowRouter.route('/', {
    action: function() {
        // BlazeLayout.render('layout', {content:"postlist"});
        // BlazeLayout 렌더링 layout template 에서 top, left key에 저장된 template을 그린다.
        BlazeLayout.render('layout', {top : 'header', left : 'sidebar', content: 'postlist'});
    }
});
FlowRouter.route('/apitest', {
    action: function() {
        BlazeLayout.render('apitest');
    }
});
FlowRouter.route('/google_api', {
    action: function() {
        BlazeLayout.render('layout', {top : 'header', left : 'sidebar', content: 'google_api'});
    }
});
FlowRouter.route('/postlist', {
    action: function() {
        BlazeLayout.render('layout', {top : 'header', left : 'sidebar', content: 'postlist'});
    }
});
FlowRouter.route('/userlist', {
    action: function() {
        BlazeLayout.render('layout', {top : 'header', left : 'sidebar', content: 'userlist'});
    }
});

FlowRouter.notFound = {
    action: function() {
    	BlazeLayout.render('notFound');
    }
};