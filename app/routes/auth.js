var express = require('express');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');

// To Load Properties from Environment
var dotenv = require('dotenv');

// To make HTTP request
var request = require('request');

// Other
var util = require('../helper/util')

// Other
var spotify = require('../helper/spotify')

//----------- Environment -----------//
dotenv.config() // Configure Environment Variables

var router = express.Router();

var client_id = process.env.CLIENT_ID; // Client id
var client_secret = process.env.CLIENT_SECRET; // Secret
var redirect_uri = process.env.REDIRECT_URI; //Redirect URI

var stateKey = 'spotify_auth_state'; // authenticated to spotify or not

// ExpressJS Routes
router.get('/login', function (req, res) {
    var state = util.generateRandomString(16);
    res.cookie(stateKey, state);

    // application requests authorization
    var scope = 'user-read-currently-playing user-modify-playback-state';
    res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: client_id,
            scope: scope,
            redirect_uri: redirect_uri,
            state: state
        }));
});

router.get('/callback', function (req, res) {

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

                //res.cookie("access_token", access_token);
                spotify.init(access_token, refresh_token);

                // we can also pass the token to the browser to make requests from there
                res.end(JSON.stringify({
                    access_token: access_token,
                    refresh_token: refresh_token
                }))
                // res.redirect('/#' +
                //     querystring.stringify({
                //         access_token: access_token,
                //         refresh_token: refresh_token
                //     }));
            } else {
                res.end(JSON.stringify({
                    error: 'invalid_token'
                }))
            }
        });
    }
});

router.get('/refresh_token', function (req, res) {

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

module.exports = router;