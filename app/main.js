// Express web server framework
var express = require('express');
var cors = require('cors');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');

// "Request" library
var request = require('request');

// To Load Properties from Environment
var dotenv = require('dotenv');

//----------- Environment -----------//
dotenv.config() // Configure Environment Variables


// Constants
const PORT = 3000;
const HOST = '0.0.0.0';


//----------- Helper Functions -----------//
/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
var generateRandomString = function (length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

//----------- ExpresJS Configuration -----------//
var stateKey = 'spotify_auth_state'; // authenticated to spotify or not

var auth_router = require('./routes/auth');
var other_router = require('./routes/other');

// init ExpressJS app
var app = express();
app.use(express.static(__dirname + '/public'))
    .use(cors())
    .use(cookieParser());

app.use('/', auth_router);
app.use('/', other_router);

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);