const express = require('express')
const router = express.Router();
const jwt = require('jsonwebtoken')
const keys = require('../../config/keys')
const passport = require('passport')
const validateRegisterInput = require('../../validation/register')
const validateLoginInput = require('../../validation/login')


const Message = require('../../models/Message')
const User = require('../../models/User')
const Conversation = require('../../models/Coversation')

router.post('/:recieverId', passport.authenticate('jwt', { session: false }), (req, res) => {

    var conversation = Conversation(
        {
            recieverId: req.params.recieverId,
            senderId: req.user._id,
            date: new Date()
        }
    )
    if (!User.findById(req.user._id)) {
        return res.json({ res: 'reciever not found' })
    }

    // conversation.collection
    Conversation.findOne(
        {
            $or: [{
                recieverId: req.user._id,
                senderId: req.params.recieverId
            }, {
                recieverId: req.params.recieverId,
                senderId: req.user._id
            }]
        }

        , function (err, found) {
            if (!found) {
                conversation.save(function (err, conv) {
                    if (err) return console.error('conversation not sent');
                    conversation = conv

                })
            } else {
                conversation = found
            }

            console.log(conversation);
            new Message({
                content: req.body.content,
                userId: req.user._id,
                recieverId: req.params.recieverId,
                conversationId: conversation._id,
                date: new Date()
            }).save(
                function (err, message) {
                    if (err) return console.error('message not sent');
                    res.json({ message, conversation })
                }
            )



        }
    );

})

router.get('/:conversationId', (req, res) => {

    conversationId = req.params.conversationId;
    Message.find(
        { conversationId: conversationId }
        , function (err, messages) {
            return res.json({ messages })
        })
})

module.exports = router