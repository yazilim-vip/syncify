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


// Other
var mqtt = require('./helper/mqtt');


mqtt.subscribe(function (received_song_id) {

    var api = require('./api');
    api.getUserDetails((user_details) => {

        console.log("Received Song ID: ", received_song_id.toString());

        api.getCurrentSong((current_song_details) => {

            // Logging Song Details
            var current_song_id = current_song_details.item.uri;
            var current_song_proggress_ms = current_song_details.progress_ms;
            var song_duration = (current_song_details.item.duration_ms / 1000 / 60);
            var song_artist = current_song_details.item.artists[0].name;
            var song_name = current_song_details.item.name;

            console.log("\n- Currently Playing Song Details ---------------")
            console.log("User Name\t:", user_details.display_name);
            console.log("Song ID  \t:", current_song_id);
            console.log("Progress (ms)\t:", current_song_proggress_ms);
            console.log("Song Name\t:", song_name);
            console.log("Song Artist\t:", song_artist)
            console.log("Song Duration\t:", song_duration)

            if (current_song_details.is_playing && received_song_id !== current_song_id) {
                api.playSong(received_song_id.toString(), 0);
            }
        });
    });

});

console.log(`Running on http://${HOST}:${PORT}`);