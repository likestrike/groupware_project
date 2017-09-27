// 2017-09-28 Account auto form simpleschema 가 현재의 구조를 다 갖추기 전까지 사용할 수 없다.
// import SimpleSchema from 'simpl-schema';
// SimpleSchema.extendOptions(['autoform']);

// Schema = {};

// Schema.UserProfile = new SimpleSchema({
// 	orgPath: {
// 		type: String
// 	},
// 	department: {
// 		type: String
// 	},
// 	fullname: {
// 		type: String
// 	},
// 	title: {
// 		type: String
// 	}
// });

// Schema.User = new SimpleSchema({
//     username: {
//         type: String,
//         // For accounts-password, either emails or username is required, but not both. It is OK to make this
//         // optional here because the accounts-password package does its own validation.
//         // Third-party login packages may not require either. Adjust this schema as necessary for your usage.
//         optional: true
//     },
//     emails: {
//         type: Array,
//         // For accounts-password, either emails or username is required, but not both. It is OK to make this
//         // optional here because the accounts-password package does its own validation.
//         // Third-party login packages may not require either. Adjust this schema as necessary for your usage.
//         optional: true
//     },
//     "emails.$": {
//         type: Object
//     },
//     "emails.$.address": {
//         type: String,
//         regEx: SimpleSchema.RegEx.Email
//     },
//     "emails.$.verified": {
//         type: Boolean
//     },
//     profile: {
//         type: Schema.UserProfile,
//         optional: true
//     }
// });

// Meteor.users.attachSchema(Schema.User);


// Meteor.users.allow({
//   insert: function () { return true; },
//   update: function () { return true; },
//   remove: function () { return true; }
// });

