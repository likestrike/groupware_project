import { Index, MinimongoEngine } from 'meteor/easy:search'
Faqs = new Mongo.Collection('faqs');
// On Client and Server
FaqsIndex = new Index({
  sort: function () {
    return { submitted : 0 };
  },
  collection: Faqs,
  fields: ['title', 'body'],
  engine: new MinimongoEngine(),
})

Faqs.allow({
  update: ownsDocument,
  remove: ownsDocument
});
Faqs.deny({
  update: function(userId, faq, fieldNames) {
    return (_.without(fieldNames, 'title', 'body').length > 0);
  }
});

Meteor.methods({
  faqInsert: function(faqAttribute) {
    check(this.userId, String);
    check(faqAttribute, {
      title : String,
      body: String
    });

    var user = Meteor.user();
    var faq = _.extend(faqAttribute, {
      userId: user._id,
      author: user.profile.fullname,
      submitted: new Date()
    });

    var faqId = Faqs.insert(faq);

    return {
      _id: faqId
    };
  }
});