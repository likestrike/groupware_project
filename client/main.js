// Meteor.subscribe('user');
Meteor.subscribe('posts');

Accounts.ui.config({
  passwordSignupFields: 'USERNAME_AND_EMAIL' //  One of 'USERNAME_AND_EMAIL', 'USERNAME_AND_OPTIONAL_EMAIL', 'USERNAME_ONLY', or 'EMAIL_ONLY' (default).
});
// google login 의 계정을 locus.com 으로 제한 한다. config
Accounts.config({ restrictCreationByEmailDomain: 'locus.com' });
