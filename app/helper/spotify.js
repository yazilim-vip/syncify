var Spotify = function () {};

var request = require('request');

var mqtt = require('./mqtt');
var access_token;
var refresh_token;

Spotify.prototype.init = (at, rt) => {
    console.log("Initializing Tokens...");
    console.log("Access Token: ", at);
    console.log("Refresh Token: ", rt);
    access_token = at;
    refresh_token = rt;
}

Spotify.prototype.apiCall = (api, callback) => {

    var options = {
        url: api,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + access_token
        },
        json: true
    };

    // use the access token to access the Spotify Web API
    request.get(options, (error, response, result) => {
        callback(result);
    });
}

Spotify.prototype.getAccessToken = () => {
    return access_token;
}

Spotify.prototype.getRefreshToken = () => {
    return refresh_token;
}

module.exports = new Spotify();