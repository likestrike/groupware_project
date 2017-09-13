// set google config
console.log(process.env.ROOT_URL);
var domain = process.env.ROOT_URL;
var server, clientId, secret;
if(domain == 'http://localhost:3000/'){
	server = 'DEV';
	clientId = '1000699696059-bta1aomjalap2249j68g0ct9f8mo32tj.apps.googleusercontent.com';
	secret = 'VJf4i8yqQoY_K4u4683LsTWy';
}else{
	server = 'REAL';
	clientId = '722330995079-vjvi89ltdo7cjigaleb33rdnd0hhm2qb.apps.googleusercontent.com';
	secret = 'QKv8B4uyQxSYchKItEYwEiWA';
}

ServiceConfiguration.configurations.upsert(
  { service: 'google' },
  {
    $set: {
      loginStyle: "popup",
      clientId: clientId, // See table below for correct property name!
      secret: secret
    }
  }
);