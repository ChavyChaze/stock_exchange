﻿var express = require('express');
var router = express.Router();
var request = require('request');
var config = require('config.json');

router.get('/', function (req, res) {
    res.render('register');
});

router.post('/', function (req, res) {
    // register using api to maintain clean separation between layers
    var route = null;

    process.env.ROOT_URL ?
        route = process.env.ROOT_URL :
        route = config.apiUrl;

    request.post({
        url: route + '/users/register',
        form: req.body,
        json: true
    }, function (error, response, body) {
        if (error) {
            return res.render('register', { error: 'An error occurred' });
        }

        if (response.statusCode !== 200) {

            return res.render('register', {
                error: response.body,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                currency: req.body.currency,
                value: req.body.value,
                username: req.body.username
            });
        }

        // return to login page with success message
        req.session.success = 'Registration successful';
        return res.redirect('/login');
    });
});

module.exports = router;