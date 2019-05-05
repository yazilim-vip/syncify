var express = require('express');
var router = express.Router();
var cookieParser = require('cookie-parser');

// "Request" library
var request = require('request');

router.get('/home', function (req, res) {

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

module.exports = router;