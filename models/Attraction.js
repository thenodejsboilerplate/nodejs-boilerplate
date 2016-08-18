
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema({
          name: { type: String, required: true, unique: true },
          description: String,
          location: { 
              lat:Number,
              lng:Number
           },//,match: /[0-9a-zA-Z_-]/
          history: {
            event: String,
            notes: String,
            email: String,
            date: Date,
          },
          updateId: String,
          approved: Boolean,
          //tags: [String],//[] means an array of string
          created_at: Date,
          updated_at: Date      
});

// on every save, add the date
userSchema.pre('save', function(next) {
  // get the current date
  var currentDate = new Date();
  
  // change the updated_at field to current date: do not leave .local
  this.local.updated_at = currentDate;

  // if created_at doesn't exist, add to that field
  if (!this.created_at){
    this.local.created_at = currentDate;
  }

  next();
});

module.exports = mongoose.model('User', userSchema);