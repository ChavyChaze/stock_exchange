const express = require('express');

const config = require('./config.json');

const app = express();

app.set('view engine', 'ejs');
app.set('views',__dirname + '/beckend/views');

// Routes
// app.use('/login', require('./beckend/...')); // TODO
// app.use('/register', require('./beckend/...')); // TODO
// app.use('/app', require('./backend/...')); // TODO

// '/app' set as default rout
app.get('/', (req, res) => {
    return res.redirect('/app');
});

// start server on port 3333 OR enviroment(when pushed to Heroku)
const server = app.listen(process.env.PORT || 3333, () => {
    console.log('Server listening on port ' + server.address().port);
});