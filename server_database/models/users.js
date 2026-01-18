let idCounter = 1;

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const User = new Schema({
    
    id : {
        type : Number,
        default : () => idCounter++
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
        required : true
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

module.exports = mongoose.model ('User', User);