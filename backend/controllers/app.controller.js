const express = require('express');
const router = express.Router();

router.use('/', function (req, res, next) { // use session auth to secure the angular files
    if (req.path !== '/login' && !req.session.token) {
        return res.redirect('/login?returnUrl=' + encodeURIComponent('/app' + req.path));
    }

    next();
});

router.get('/token', function (req, res) { // avvailable JWT token to angualr
    res.send(req.session.token);
});

router.use('/', express.static('src')); // serve angular app files from '/src'

module.exports = router;