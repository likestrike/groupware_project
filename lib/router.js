function checkLoggedIn (ctx, redirect) {
  if (!Meteor.userId()) {
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
		BlazeLayout.render('layout', {top : 'header', left : 'sidebar', content: 'postlist', footer : 'footer'});
	}
});
privateRoutes.route('/postlist', {
	name: 'postlist',
	action: function () {
		BlazeLayout.render('layout', {top : 'header', left : 'sidebar', content: 'postlist', footer : 'footer'});
	}
});
privateRoutes.route('/userlist', {
	name: 'userlist',
	action: function () {
		BlazeLayout.render('layout', {top : 'header', left : 'sidebar', content: 'userlist', footer : 'footer'});
	}
});
privateRoutes.route('/faqlist', {
	name: 'faqlist',
	action: function () {
		BlazeLayout.render('layout', {top : 'header', left : 'sidebar', content: 'faqlist', footer : 'footer'});
	}
});
privateRoutes.route('/profile', {
	name: 'profile',
	action: function () {
		BlazeLayout.render('layout', {top : 'header', left : 'sidebar', content: 'profile', footer : 'footer'});
	}
});
privateRoutes.route('/blind', {
	name: 'blind',
	action: function () {
		BlazeLayout.render('layout', {top : 'header', left : 'sidebar', content: 'blind', footer : 'footer'});
	}
});
privateRoutes.route('/google_api', {
	name: 'google_api',
	action: function () {
		BlazeLayout.render('layout', {top : 'header', left : 'sidebar', content: 'google_api', footer : 'footer'});
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