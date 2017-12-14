function checkLoggedIn (ctx, redirect) {
  if(!Meteor.loggingIn() && !Meteor.userId()) {
    redirect('/login');
  }
}
// root group
// 로그인 체크를 하기 위해 triggerEnter에 function 선언, 반드시 로그인이 필요한 메뉴들에 대해서는 private Roouter에 넣는다.
var privateRoutes = FlowRouter.group({
	name: 'private',
	subscriptions: function(params, queryParams) {
		this.register('notifications', Meteor.subscribe('notifications'));
	},
	triggersEnter: [checkLoggedIn]
});

//routing as home page (/), rendering layout template
privateRoutes.route('/', {
	name: 'index',
	subscriptions: function(params, queryParams) {
		this.register('meeting_times', Meteor.subscribe('meeting_times'));
	},
	action: function () {
		BlazeLayout.render('layout', {top : 'header', left : 'sidebar', content: 'home' , controls : 'controles'});
	}
});
privateRoutes.route('/postlist', {
	name: 'postlist',
	subscriptions: function(params, queryParams) {
		this.register('posts', Meteor.subscribe('posts'));
	},
	action: function () {
		BlazeLayout.render('layout', {top : 'header', left : 'sidebar', content: 'postlist', controls : 'controles'});
	}
});
privateRoutes.route('/userlist', {
	name: 'userlist',
	subscriptions: function(params, queryParams) {
		// client main.js 에서 subscribe를 실행하지 않고 router를 통해 보낼 수 있다.
        this.register('user', Meteor.subscribe('user'));
    },
	action: function () {
		BlazeLayout.render('layout', {top : 'header', left : 'sidebar', content: 'userlist', controls : 'controles'});
	}
});
privateRoutes.route('/faqlist', {
	name: 'faqlist',
	subscriptions: function(params, queryParams) {
        this.register('faqs', Meteor.subscribe('faqs'));
    },
	action: function () {
		BlazeLayout.render('layout', {top : 'header', left : 'sidebar', content: 'faqlist', controls : 'controles'});
	}
});
privateRoutes.route('/myprofile', {
	subscriptions: function(params, queryParams) {
		console.log(params);
		var user_id = { '_id' : Meteor.userId()};
        Meteor.subscribe('userProfile', user_id);
    },
    action: function(params, queryParams) {
        BlazeLayout.render('layout', {top : 'header', left : 'sidebar', content: 'profile', controls : 'controles'});
    }
});
privateRoutes.route('/profile/:_id', {
	subscriptions: function(params, queryParams) {
		var user_id = params;
		console.log(user_id);
        Meteor.subscribe('userProfile', user_id);
    },
    action: function(params, queryParams) {
        BlazeLayout.render('layout', {top : 'header', left : 'sidebar', content: 'profile', controls : 'controles'});
    }
});
privateRoutes.route('/blindlist', {
	name: 'blindlist',
	subscriptions: function(params, queryParams) {
		this.register('blinds', Meteor.subscribe('blinds'));
    },
	action: function () {
		BlazeLayout.render('layout', {top : 'header', left : 'sidebar', content: 'blindlist', controls : 'controles'});
	}
});
privateRoutes.route('/google_api', {
	name: 'google_api',
	action: function () {
		BlazeLayout.render('layout', {top : 'header', left : 'sidebar', content: 'google_api', controls : 'controles'});
	}
});
privateRoutes.route('/extractor/:data', {
	subscriptions: function(params, queryParams) {
		console.log(params);
		console.log(queryParams);
    },
    action: function(params, queryParams) {
        // BlazeLayout.render('tagviewer'});
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

// Temp route
FlowRouter.route('/book', {
    action: function() {
    	BlazeLayout.render('insertBookForm');
        // BlazeLayout.render('signup');
    }
});

FlowRouter.notFound = {
    action: function() {
    	BlazeLayout.render('notFound');
    }
};