require('rootpath')();
const express = require('express');
const session = require('cookie-session');
const bodyParser = require('body-parser');
const expressJwt = require('express-jwt');

const config = require('config.json');

const app = express();

app.set('view engine', 'ejs');
app.set('views',__dirname + '/beckend/views');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({ secret: config.secret, resave: false, saveUninitialized: true }));

// use JWT auth to secure the app
app.use('/api', expressJwt({ secret: config.secret }).unless({ path: ['/api/users/authenticate', '/api/users/register'] }));

/// Routes
app.use('/login', require('./backend/controllers/login'));
app.use('/register', require('./backend/controllers/register'));
app.use('/app', require('./backend/controllers/app'));
app.use('/api/users', require('./backend/controllers/api/users'));
app.use('/api/currency', require('./backend/controllers/currency'));

// '/app' set as default rout
app.get('/', (req, res) => {
    return res.redirect('/app');
});

// start server on port 3333 OR enviroment(when pushed to Heroku)
const server = app.listen(process.env.PORT || 3333, () => {
    console.log('Server listening on port ' + server.address().port);
});