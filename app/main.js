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
var client_id = process.env.CLIENT_ID; // Client id
var client_secret = process.env.CLIENT_SECRET; // Secret
var redirect_uri = process.env.REDIRECT_URI; //Redirect URI


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

// init ExpressJS app
var app = express();
app.use(express.static(__dirname + '/public'))
    .use(cors())
    .use(cookieParser());

// ExpressJS Routes
app.get('/login', function (req, res) {
    var state = generateRandomString(16);
    res.cookie(stateKey, state);

    // application requests authorization
    var scope = 'user-read-currently-playing';
    res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: client_id,
            scope: scope,
            redirect_uri: redirect_uri,
            state: state
        }));
});

app.get('/callback', function (req, res) {

    // your application requests refresh and access tokens
    // after checking the state parameter

    var code = req.query.code || null;
    var state = req.query.state || null;
    var storedState = req.cookies ? req.cookies[stateKey] : null;


    if (state === null || state !== storedState) {
        res.redirect('/#' +
            querystring.stringify({
                error: 'state_mismatch'
            }));
    } else {
        res.clearCookie(stateKey);
        var authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            form: {
                code: code,
                redirect_uri: redirect_uri,
                grant_type: 'authorization_code'
            },
            headers: {
                'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
            },
            json: true
        };

        request.post(authOptions, function (error, response, body) {
            if (!error && response.statusCode === 200) {

                var access_token = body.access_token;
                var refresh_token = body.refresh_token;

                res.cookie("access_token", access_token);


                // we can also pass the token to the browser to make requests from there
                res.redirect('/#' +
                    querystring.stringify({
                        access_token: access_token,
                        refresh_token: refresh_token
                    }));
            } else {
                res.redirect('/#' +
                    querystring.stringify({
                        error: 'invalid_token'
                    }));
            }
        });
    }
});

app.get('/refresh_token', function (req, res) {

    // requesting access token from refresh token
    var refresh_token = req.query.refresh_token;
    var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: {
            'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
        },
        form: {
            grant_type: 'refresh_token',
            refresh_token: refresh_token
        },
        json: true
    };

    request.post(authOptions, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            var access_token = body.access_token;
            res.send({
                'access_token': access_token
            });
        }
    });
});


app.get('/home', function (req, res) {

    var options = {
        url: 'https://api.spotify.com/v1/me/player/currently-playing',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + req.cookies.access_token
        },
        json: true
    };

    // use the access token to access the Spotify Web API
    request.get(options, function (err, resp, result) {

        console.log("Mustafa is Listening : ", (result.item.duration_ms / 1000 / 60), result.item.artists[0].name, result.item.name)

        var songId = result.item.uri;
        var progressMs = result.progress_ms;
        var isPlaying = result.is_playing;
        if (!isPlaying) {
            return;
        }
        console.log('Read songId=', songId);

        // publish songId

    });

});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);