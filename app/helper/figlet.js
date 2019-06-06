var Figlet = function () {};

var figlet = require('figlet');

Figlet.prototype.print = function (text) {
    figlet(text, function (err, data) {
        if (err) {
            console.log('Something went wrong...');
            console.dir(err);
            return;
        }
        console.log(data)
    });
};

module.exports = new Figlet();