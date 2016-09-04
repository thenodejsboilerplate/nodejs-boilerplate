//./models/Tag.js
"use strict";
const mongoose = require('mongoose'),
      Schema = mongoose.Schema,
      User = require('../models/User'),
      Post = require('../models/Post'),
      moment = require('moment');

// create a schema
//The allowed SchemaTypes are:
// String
// Number
// Date
// Buffer
// Boolean
// Mixed
// ObjectId
// Array
var tagSchema = new Schema({
          user_id: { type: String, required: true },
          post_id: { type: String, required: true },
          name: { type: String, required: true},
          count: { type: Number, required: true, default: 0},
          created_at: {type: Date, default: Date.now()},
          updated_at: {type: Date, default: Date.now()},
   
});



// on every save, add the date
tagSchema.pre('save', function(next){
  // get the current date
  const currentDate = new Date();
  
  // change the updated_at field to current date: do not leave .local
  this.updated_at = currentDate;

  // if created_at doesn't exist, add to that field
  if (!this.created_at){
    this.created_at = currentDate;
  }

  next();
});


tagSchema.methods.time = time=> {
    return moment(time).format('L');
};

tagSchema.methods.processTag = tag=>{

    let tagsArray = tag.split(',');
    return {
        _id:tag._id,
        user_id: tag.user_id,
        post_id: tag.post_id,
        name: post.name,
        tags: tagsArray, 
        created_at: tag.time(tag.created_at),
        updated_at: tag.time(tag.updated_at),            
    };
};


tagSchema.methods.posts = tag=>{

         Post.findById(tag.post_id).exec((err,user)=>{
                if(err){
                    console.log(`cannot catch user,error: ${err}`);
                    req.flash('error',`error in find user for ${user_id}`);
                    res.redirect('back');							
                }else{
                    console.log(user);
                    let modifiedUser = user.processUser(user)
                    console.log(modifiedUser);
                    fn(modifiedUser);
                  
              }
        });

};



// make this available to our users in our Node applications
module.exports = mongoose.model('Tag', tagSchema);