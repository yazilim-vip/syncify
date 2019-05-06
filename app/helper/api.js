var Api = function () {};

var request = require('request');

var Spotify = require('./spotify');



Api.prototype.getCurrentSong = (callback) => {
    Spotify.apiCall('https://api.spotify.com/v1/me/player/currently-playing', callback);
}

Api.prototype.getUserDetails = (callback) => {
    Spotify.apiCall('https://api.spotify.com/v1/me', callback);
}

Api.prototype.playSong = (song_id, position_ms) => {

    request({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + Spotify.getAccessToken()
        },
        body: JSON.stringify({
            "uris": [
                song_id
            ],
            "offset": {
                "position": 0
            },
            "position_ms": position_ms,
        }),
        uri: 'https://api.spotify.com/v1/me/player/play',
        method: 'PUT'
    }, function (err, res, body) {});

}



module.exports = new Api();