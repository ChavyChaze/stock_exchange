const express = require('express');
const router = express.Router();
const request = require('request');

router.get('/', function (req, res) {
    request.get({
        url: 'http://webtask.future-processing.com:8068/stocks'
    }, function (error, response, body) {
        if (error) {
            return res.status(500).send(body);
        }

        res.status(response.statusCode).send(body);
    });
});

module.exports = router;