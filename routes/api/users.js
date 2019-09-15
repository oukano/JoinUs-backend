const express = require('express')
const router = express.Router();
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const keys = require('../../config/keys')
const passport = require('passport')
const validateRegisterInput = require('../../validation/register')
const validateLoginInput = require('../../validation/login')

const  User = require('../../models/User')
// @route   GET api/users/test
// @desc    Tests users route
// @access  Public
router.get('/test', (req,res) => res.json({msg : "user works"}))

// @route   GET api/users/register
// @desc    Register users
// @access  Public

router.post('/register', (req,res)=> {
    const {errors, isValid } = validateRegisterInput(req.body)

    // check validation
    if(!isValid) {
        return res.status(400).json(errors)
    }
    User.findOne({email: req.body.email})
        .then(user => {
            if(user) {
                errors.email = 'Email already exist'
                return res.status(400).json(errors)
            }else{
                const avatar = gravatar.url(req.body.email,{
                    s: '200', // size
                    r:'pg',  // rating
                    d: 'mm' // default
                })  
                const newUser = new User({
                    name: req.body.name,
                    email : req.body.email,
                    avatar,
                    password: req.body.password,
                    rfer : 'cwefwe'
                })

                const payload = {id : newUser.id, name: newUser.name, avatar: newUser.avatar} // Create JWT avatar
                // Sign Token
                jwt.sign(payload, keys.secretOrKey ,
                     {expiresIn : 86400},
                     (err, token) => {
                        newUser.token = token;

                })
                    
                bcrypt.genSalt(10, (err, salt)=> {
                    bcrypt.hash(newUser.password, salt, (err, hash)=> {
                    
                        if(err) throw err;
                        newUser.password = hash;
                        newUser
                        .save()
                        .then(user => res.json(user))
                        .catch(err => console.log(err))
                    })
                })

                
            }
        })
})
// @route   POST api/users/login
// @desc    Login User / Returning JWT Token
// @access  Public

router.post('/login', (req, res) => {

    const {errors, isValid } = validateLoginInput(req.body)

    // check validation
    if(!isValid) {
        return res.status(400).json(errors)
    }

    const email = req.body.email;
    const password = req.body.password;
    // Find user by email
    User.findOne({email})
        .then(user => {
            if(!user) {
                errors.email = 'User not found'
                return res.status(400).json(errors)
            }
            // check password
            bcrypt.compare(password, user.password)
            .then(isMatch => {
                if(isMatch) {
                        res.json({
                            user
                        })
                }else{
                    errors.password = 'Password Incorrect'
                    return res.status(400).json(errors)
                }
            })
        })
})

// @route   GET api/users/current
// @desc    return current user
// @access  Private

router.get('/current', passport.authenticate('jwt', {session : false}),(req, res)=>{
    res.json({
        id : req.user.id,
        name: req.user.name,
        email: req.user.email
    })
})
module.exports = router