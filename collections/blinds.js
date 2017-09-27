import SimpleSchema from 'simpl-schema';
SimpleSchema.extendOptions(['autoform']);


Blinds = new Mongo.Collection("blinds");
Blinds.attachSchema(new SimpleSchema({
  context: {
    type: String
  },
  userId:{
    type: String,
    autoform:{
      type:"hidden",
      label: false
    },
    autoValue:function(){return Meteor.userId()},
  },
  author:{
    type: String,
    autoform:{
      type:"hidden",
      label: false
    },
    autoValue:function(){return 'Unkown'},
  }, 
  submitted:{
    type: Date,
    autoform:{
      type:"hidden",
      label: false
    },
    autoValue:function(){return new Date()},
  }
},{ tracker: Tracker }));

Blinds.allow({
  insert: function () { return true; },
  update: function () { return true; },
  remove: function () { return true; }
});
Meteor.methods({
  insertBlind: function(blidAttributes) {
    console.log(blidAttributes);
    check(this.userId, String);
    check(blidAttributes, {
      context: String
    });

    var user = Meteor.user();
    var blind = _.extend(blidAttributes, {
      userId: user._id,
      author: 'Unkown',
      submitted: new Date()
    });

    var postId = Blinds.insert(blind);

    return {
      _id: postId
    };
  },
});
