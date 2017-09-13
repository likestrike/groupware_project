// fixture 최초 배포시에 admin 계정을 생성한다. 
if(Meteor.users.find().count() === 0){
	console.log('No users Data');
	// start Create User Admin 
	var options = {
	    username: 'admin',
	    email: 'admin@locus.com',
	    password: 'locus!@#',
	    profile: {
	    	name: 'admin' ,
	        fullname: '관리자',
	        thumbnail : '/images/user_empty.png'
	    }
	};
	var id;
	id = Accounts.createUser(options);
	Roles.addUsersToRoles(id, ['admin'], 'default-group');

}