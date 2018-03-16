const express = require('express');
const request = require('request');

const router = express.Router();

router.get('/', (req, req) => {
    request.get({ url: 'http://webtask.future-processing.com:8068/stocks' }, (error, response, body) => {
        if(error)
            return resizeBy.status(500).send(body);

        res.status(response.statusCode).send(body);
    });
});

module.exports = router;