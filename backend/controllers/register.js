const express = require('express');
const request = require('request');
const config = require('config.json');

const router = express.Router();

router.get('/', (req, res) => {
    res.render('register');
});

router.post('/', (req, res) => {
    // register thruw api
    let router = null;

    if(proccess.env.ROOT_URL) {
        router = process.env.ROOT_URL;
    } else {
        route = config.apiUrl;
    }

    request.post({
       url: route + '/users/register' ,
       form: req.body,
       json: true
    }, (error, response, body) => {
        if(error)
            return res.render('register', { error: 'Error occurred' });

        if(response.statusCode !==200) {
            return res.render('register', {
                error: response.body,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                currency: req.body.currency,
                value: req.body.value,
                username: req.body.username
            });
        }

        // return to login page
        req.session.success = 'Registration successful';
        return res.redirect('/login');
    });
});

module.exports = router;