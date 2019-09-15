const express = require('express')
const router = express.Router();
const jwt = require('jsonwebtoken')
const keys = require('../../config/keys')
const passport = require('passport')
const validateRegisterInput = require('../../validation/register')
const validateLoginInput = require('../../validation/login')


const  Message = require('../../models/Message')
const  Conversation = require('../../models/Coversation')

router.post('/:recieverId', passport.authenticate('jwt',  {session : false}),  (req, res) => {

    var message = new Message({
        content    : req.body.content,
        userId     : req.user._id,
        recieverId : req.params.recieverId,
        date       : new Date()
    })

    var conversation = Conversation(
        {
        recieverId : req.params.recieverId,
        senderId   : req.user._id,
        date       : new Date()
    }
    )
    
    message.save(function (err, book) {
        if (err) return console.error('message not sent');
    })

// conversation.collection
Conversation.update({
        recieverId : req.params.recieverId,
    senderId   : req.user._id,
    },{
        date       : new Date()
    },
    { upsert : true }
    ).then(conv => res.json({
        conv
    }));

        

})

router.get('/:userId', (req, res) => {
    return res.json({
        recieverId : 'gooood'
    })
})

module.exports = router