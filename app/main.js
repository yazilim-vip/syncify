// Express web server framework
var express = require('express');
var cors = require('cors');
var cookieParser = require('cookie-parser');

//----------- ExpresJS Configuration -----------//
// Constants
const PORT = 3000;
const HOST = '0.0.0.0';

// Routings
var auth_router = require('./routes/auth');
var other_router = require('./routes/other');

// Init ExpressJS app
var app = express();
app.use(express.static(__dirname + '/public'))
    .use(cors())
    .use(cookieParser())
    .use('/', auth_router)
    .use('/', other_router)

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);