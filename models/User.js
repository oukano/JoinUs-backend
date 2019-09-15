const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// Create Shema

const UserSchema = new Schema({
    name: {
        type:  String,
        
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    avatar : {
        type: String,
    },
    token :{
        type: String,
        required: true,
        default : '---'
    },
    date :{
        type: Date,
        default : Date.now()
    }
})

module.exports = User = mongoose.model('users', UserSchema)