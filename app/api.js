var Api = function () {};

var Spotify = require('./helper/spotify');

Api.prototype.getCurrentSong = () => {
    Spotify.apiCall(
        // API URL
        'https://api.spotify.com/v1/me/player/currently-playing'

        // Callback
        , (result) => {
            console.log("Mustafa is Listening : ", (result.item.duration_ms / 1000 / 60), result.item.artists[0].name, result.item.name)
            var songId = result.item.uri;
            var progressMs = result.progress_ms;
            var isPlaying = result.is_playing;
            if (!isPlaying) {
                return;
            }
            console.log('Currently playing songId=', songId);
            mqtt.publish(songId);
        });
}

Api.prototype.getUserDetails = (callback) => {
    Spotify.apiCall('https://api.spotify.com/v1/me', callback);
}

module.exports = new Api();