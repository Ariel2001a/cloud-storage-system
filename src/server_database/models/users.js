const Counter = require('./counterUsers');

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const User = new Schema({
    
    id : {
        type : Number,
        unique : true
    },

    first_name : {
        type : String,
        required : true
    },

    last_name : {
        type : String,
        required : true
    },

    email : {
        type : String,
        required : true,
        unique : true
    },
    
    password : {
        type : String,
        required : true
    },

    image : {

        type : String,
        default : "default"
    } 

});

User.pre('save', async function(next) {
  if (this.isNew) {
    const counter = await Counter.findByIdAndUpdate(
      { _id: 'userId' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    this.id = counter.seq;
  }
});

module.exports = mongoose.model ('User', User);