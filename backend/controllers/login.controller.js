const express = require('express');
const router = express.Router();
const request = require('request');
const config = require('config.json');

router.get('/', function (req, res) {
    delete req.session.token; // logout

    let viewData = { success: req.session.success }; // move success message into local constiable so it only appears once
    delete req.session.success;

    res.render('login', viewData);
});

router.post('/', function (req, res) {    
    let route = null; // authenticate using api to maintain clean separation between layers

    process.env.ROOT_URL ?
        route = process.env.ROOT_URL :
        route = config.apiUrl;

    request.post({
        url: route + '/users/authenticate',
        form: req.body,
        json: true
    }, function (error, response, body) {
        if (error) {
            return res.render('login', { error: 'An error occurred' });
        }

        if (!body.token) {
            return res.render('login', { error: body, username: req.body.username });
        }

        req.session.token = body.token; // save JWT token in the session

        let returnUrl = req.query.returnUrl && decodeURIComponent(req.query.returnUrl) || '/'; // redirect to returnUrl
        res.redirect(returnUrl);
    });
});

module.exports = router;