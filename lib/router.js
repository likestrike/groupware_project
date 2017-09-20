function checkLoggedIn (ctx, redirect) {
  if(!Meteor.loggingIn() && !Meteor.userId()) {
    redirect('/login');
  }
}
// root group
// 로그인 체크를 하기 위해 triggerEnter에 function 선언, 반드시 로그인이 필요한 메뉴들에 대해서는 private Roouter에 넣는다.
var privateRoutes = FlowRouter.group({
  name: 'private',
  triggersEnter: [checkLoggedIn]
});

//routing as home page (/), rendering layout template
privateRoutes.route('/', {
	name: 'index',
	action: function () {
		BlazeLayout.render('layout', {top : 'header', left : 'sidebar', content: 'postlist'});
	}
});
privateRoutes.route('/postlist', {
	name: 'postlist',
	action: function () {
		BlazeLayout.render('layout', {top : 'header', left : 'sidebar', content: 'postlist'});
	}
});
privateRoutes.route('/userlist', {
	name: 'userlist',
	subscriptions: function(params, queryParams) {
		// client main.js 에서 subscribe를 실행하지 않고 router를 통해 보낼 수 있다.
        this.register('user', Meteor.subscribe('user'));
    },
	action: function () {
		BlazeLayout.render('layout', {top : 'header', left : 'sidebar', content: 'userlist'});
	}
});
privateRoutes.route('/faqlist', {
	name: 'faqlist',
	action: function () {
		BlazeLayout.render('layout', {top : 'header', left : 'sidebar', content: 'faqlist'});
	}
});
privateRoutes.route('/profile', {
	name: 'profile',
	action: function () {
		BlazeLayout.render('layout', {top : 'header', left : 'sidebar', content: 'profile'});
	}
});
privateRoutes.route('/profile/:_id', {
    action: function(params, queryParams) {
    	console.log("Yeah! We are on the post:", params);
        BlazeLayout.render('layout', {top : 'header', left : 'sidebar', content: 'profile'});
    }
});
privateRoutes.route('/blind', {
	name: 'blind',
	action: function () {
		BlazeLayout.render('layout', {top : 'header', left : 'sidebar', content: 'blind'});
	}
});
privateRoutes.route('/google_api', {
	name: 'google_api',
	action: function () {
		BlazeLayout.render('layout', {top : 'header', left : 'sidebar', content: 'google_api'});
	}
});


// login은 private에서 제외한다.
FlowRouter.route('/login', {
    action: function() {
    	BlazeLayout.render('layout', {login : 'login'});
        // BlazeLayout.render('login');
    }
});
FlowRouter.route('/signup', {
    action: function() {
    	BlazeLayout.render('layout', {signup : 'signup'});
        // BlazeLayout.render('signup');
    }
});

FlowRouter.notFound = {
    action: function() {
    	BlazeLayout.render('notFound');
    }
};