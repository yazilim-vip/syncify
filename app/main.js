// Express web server framework
var express = require('express');
var cors = require('cors');
var cookieParser = require('cookie-parser');

var figlet = require('./helper/figlet');
figlet.print('Syncify');

//----------- ExpresJS Configuration -----------//
// Constants
const PORT = 3000;
const HOST = '0.0.0.0';

// Routings
var auth_router = require('./routes/auth');

// Init ExpressJS app
var app = express();
app.use(express.static(__dirname + '/public'))
    .use(cors())
    .use(cookieParser())
    .use('/', auth_router)

app.listen(PORT, HOST);


// Other
var mqtt = require('./helper/mqtt');

const TIMEOUT = 200;  // 0.5 second
var old_song_id = -1;

setInterval(function () {
    var api = require('./helper/api');
    api.getCurrentSong((current_song_details) => {
        if (current_song_details === undefined || "error" in current_song_details) {
            return;
        }

        var current_song_id = current_song_details.item.uri;
        if (current_song_details.is_playing && old_song_id.toString() !== current_song_id.toString()) {
            mqtt.publish(current_song_id);
            old_song_id = current_song_id;
        }
    });
}, TIMEOUT);

mqtt.subscribe(function (received_song_id) {
    var api = require('./helper/api');
    var prettyMs = require('pretty-ms');
    api.getUserDetails((user_details) => {
        
        api.getCurrentSong((current_song_details) => {
            if (current_song_details === undefined || "error" in current_song_details) {
                return;
            }

            // Logging Song Details
            var current_song_id = current_song_details.item.uri;
            var current_song_proggress_ms = current_song_details.progress_ms;
            var song_duration = current_song_details.item.duration_ms;
            var song_artist = current_song_details.item.artists[0].name;
            var song_name = current_song_details.item.name;

            if (current_song_details.is_playing && received_song_id.toString() !== current_song_id.toString()) {
                console.log("\nReceived Song ID: ", received_song_id.toString());
                api.playSong(received_song_id.toString(), 0);
                console.log("- Previous Playing Song Details ---------------")
                console.log("User Name\t:", user_details.display_name);
                console.log("Song ID  \t:", current_song_id);
                console.log("Song Artist\t:", song_artist)
                console.log("Song Name\t:", song_name);
                console.log("Progress \t:", prettyMs(current_song_proggress_ms));
                console.log("Song Duration\t:", prettyMs(song_duration), "\n")
            }
        });
    });
});

console.log(`Running on http://${HOST}:${PORT}`);