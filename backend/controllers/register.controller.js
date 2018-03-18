const express = require('express');
const router = express.Router();
const request = require('request');
const config = require('config.json');

router.get('/', function (req, res) {
    res.render('register');
});

router.post('/', function (req, res) {
    let route = null; // register using api to maintain clean separation between layers

    process.env.ROOT_URL ?
        route = process.env.ROOT_URL :
        route = config.apiUrl;

    request.post({
        url: route + '/users/register',
        form: req.body,
        json: true
    }, function (error, response, body) {
        if (error) {
            return res.render('register', { error: 'Error occurred' + error});
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

        req.session.success = 'Registration successful'; // return to login page with success message
        return res.redirect('/login');
    });
});

module.exports = router;