const express = require('express');

const router = express.Router();

// use session auth to secure app files
router.use('/', (req, res, next) => {
    if(req.path !== '/login' && !req.session.token)
        return res.redirect('/login&returnUrl=' + encodeURIComponent('/app' + req.path));

    next();
});

// give app access to JWT token
router.get('/token', function(req, res) {
    res.send(req.session.token);
});

// serve app files from '/src' route
router.use('/', express.static('src'));

module.exports = router;