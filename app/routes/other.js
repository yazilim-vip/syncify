var express = require('express');
var router = express.Router();
var cookieParser = require('cookie-parser');

// "Request" library


// Other
var api = require('../api')

router.get('/home', function (req, res) {

    api.getUserDetails((result) => {
        console.log(result);
    });

});

module.exports = router;