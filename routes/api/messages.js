const express = require('express')
const router = express.Router();
const jwt = require('jsonwebtoken')
const keys = require('../../config/keys')
const passport = require('passport')
const validateRegisterInput = require('../../validation/register')
const validateLoginInput = require('../../validation/login')


const Message = require('../../models/Message')
const Conversation = require('../../models/Coversation')

router.post('/:recieverId', passport.authenticate('jwt', { session: false }), (req, res) => {

    var conversation = Conversation(
        {
            recieverId: req.params.recieverId,
            senderId: req.user._id,
            date: new Date()
        }
    )
    // conversation.collection
    Conversation.findOne(
        {
            recieverId: req.params.recieverId,
            senderId: req.user._id
        }
        , function (err, found) {
            if (!found) {
                conversation.save(function (err, conversation) {
                    if (err) return console.error('message not sent');

                    new Message({
                        content: req.body.content,
                        userId: req.user._id,
                        recieverId: req.params.recieverId,
                        converstaionId: conversation._id,
                        date: new Date()
                    }).save(
                        function (err, message) {
                            if (err) return console.error('message not sent');
                            res.json({ message, conversation })
                        }
                    )
                })
            } else {
                console.log('found');
                res.json({ conversation })

            }
        });

})

router.get('/:userId', (req, res) => {
    return res.json({
        recieverId: 'gooood'
    })
})

module.exports = router