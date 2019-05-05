var Mqtt = function () {};

var mqtt = require('mqtt');
var client = mqtt.connect('mqtt://broker.hivemq.com');

var TOPIC_NEW_SONG = "syncify/newsong";

Mqtt.prototype.subscribe = function (callback) {
    client.on('connect', () => {
        client.subscribe(TOPIC_NEW_SONG);
    });

    client.on('message', (topic, message) => {
        if (topic === TOPIC_NEW_SONG) {
            var songId = message;
            callback(songId);
        }
    });
};

Mqtt.prototype.publish = function (songId) {
    client.publish(TOPIC_NEW_SONG, songId);
};

module.exports = new Mqtt();