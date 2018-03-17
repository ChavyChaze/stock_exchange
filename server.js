require('rootpath')();
const express = require('express');
const app = express();
const session = require('cookie-session');
const bodyParser = require('body-parser');
const expressJwt = require('express-jwt');
const config = require('config.json');

app.set('view engine', 'ejs');
app.set('views', __dirname + '/backend/views');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({ secret: config.secret, resave: false, saveUninitialized: true }));

// use JWT auth to secure the api
app.use('/api', expressJwt({ secret: config.secret }).unless({ path: ['/api/users/authenticate', '/api/users/register'] }));

// routes
app.use('/login', require('./backend/controllers/login.controller'));
app.use('/register', require('./backend/controllers/register.controller'));
app.use('/app', require('./backend/controllers/app.controller'));
app.use('/api/users', require('./backend/controllers/api/users.controller'));
app.use('/api/currency', require('./backend/controllers/currency.controller'));

// make '/app' default route
app.get('/', function (req, res) {
    return res.redirect('/app');
});

// start server
const server = app.listen(process.env.PORT || 5000, function () {
    console.log('Server listening at http://' + server.address().address + ':' + server.address().port);
});