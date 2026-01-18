const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Permission = new Schema({
    
    id : {
        type : Date,
        default : Date.now
    },

    userId : {
        type : Number,
        required : true
    },

    fileId : {
        type : Date,
        required : true
    },

    permission : {
        type : String,
        enum: ['read', 'write', 'owner', null],
        default : null
    }

});

module.exports = mongoose.model ('Permission', Permission);