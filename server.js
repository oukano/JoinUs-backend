const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const passport = require('passport')

const users = require('./routes/api/users')
const messages = require('./routes/api/messages')


const app = express();

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// DB Config
const db = require('./config/keys').mongoURI;

// Connecting to mongoDb
mongoose
.connect(db, { useNewUrlParser: true , useUnifiedTopology: true})
.then(()=> console.log('Mongo DB is Connectiong'))
.catch(error => console.log(error))

// Passport MiddleWare
app.use(passport.initialize())

// Passport Config
require('./config/passport')(passport)

// use routes
app.use('/api/users', users)
app.use('/api/messages', messages)

const port = process.env.PORT || 3000;

app.listen(port , ()=> console.log(`Server Running on port ${port}`))