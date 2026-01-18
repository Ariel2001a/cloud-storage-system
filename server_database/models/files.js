let idCounter = 1;

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const File = new Schema({
    
    id : {
        type : Number,
        default : () => idCounter++
    },

    ownerId: {
        type : Number,
        required : true
    },

    name : {
        type : String,
        required : true
    },

    type : {
        type : String,
        required : true
    },

    date : {
        type : Date,
        default : Date.now
    },

    size : {
        type : Number,
        default : 0
    },

    folderParent : {
        type : Number,
        default : null
    },

    starred : {
        type : Boolean,
        default : false
    },

    pub : {
        type : Boolean,
        default : false
    },

    bin : {
        type : Boolean,
        default : false
    },
    
    path : {
        type : String,
        default : null
    }

});

module.exports = mongoose.model ('File', File);