const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// Create Shema

const ConversationSchema = new Schema({
    senderId: {
        type: String,
        required: true,
        ref: 'users'
    },
    recieverId: {
        type: String,
        required: true,
        ref: 'users'
    },
    date :{
        type: Date,
        default : Date.now()
    }
})

module.exports = Conversation = mongoose.model('conversations', ConversationSchema)