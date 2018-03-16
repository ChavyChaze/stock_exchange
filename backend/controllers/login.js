const express = require('express');
const request = require('request');
const config = require('config.json');

const router = express.Router();

router.get('/', (req, res) => {
    delete req.session.token; // logout user

    // moving success message into local variable(its appears once)
    const viewData = { success: req.session.success };
    delete req.session.success;

    res.render('login', viewData);
});

router.post('/', (req, res) => {
    // authenticate with api, to clean layers separation
    let route = null;

    if(proccess.env.ROOT_URL) {
        router = process.env.ROOT_URL;
    } else {
        route = config.apiUrl;
    }

    request.post({
        url: route + '/users/authenticate',
        form: req.body,
        json: true
    }, (error, response, body) => {
        if(error)
            return res.render('login', { error: 'An error occurred' });

        if(!body.token)
            return res.render('login', { error: body, username: req.body.username });

        // save JWT token in session to have access from angular
        req.session.token = body.token;

        // redirect to returnUrl
        let returnUrl = req.query.returnUrl && decodeURIComponent(req.query.returnUrl) || '/';
    });
});

module.exports = router;