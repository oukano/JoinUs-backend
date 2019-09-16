const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// Create Shema

const MessageSchema = new Schema({
    content: {
        type:  String,
        required: true
        
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'users'
    },
    recieverId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'users'
    },
    conversationId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    date :{
        type: Date,
        default : Date.now()
    }
})

module.exports = Message = mongoose.model('messages', MessageSchema)