const config = require('config.json');
const express = require('express');
const router = express.Router();
const userService = require('backend/services/user');

/// Routes
router.post('/authenticate', authenticateUser);
router.post('/register', registerUser);
router.get('/current', getCurrentUser);
router.put('/:_id', updateUser);
router.delete('/:_id', deleteUser);

function authenticateUser(req, res) {
    userService.authenticate(req.body.username, req.body.password)
        .then(token => {
            if (token) {
                res.send({ token }); // authentication successful
            } else {
                res.status(401).send('Username or password is incorrect'); // authentication failed
            }
        })
        .catch((err) => {
            res.status(400).send(err);
        });
};

function registerUser(req, res) {
    userService.create(req.body)
        .then(() => {
            res.sendStatus(200);
        })
        .catch((err) => {
            res.status(400).send(err);
        });
};

function getCurrentUser(req, res) {
    userService.getById(req.user.sub)
        .then(user => {
            if(user){
                res.send(user);
            } else {
                res.sendStatus(404);
            }
        })
        .catch((err) => {
            res.status(400).send(err);
        });
};

function updateUser(req, res) {
    const userId = req.user.sub;    
    if(req.params._id !== userId){
        return res.status(401).send('You can\'t update others account'); // denied accessing others accounts
    }

    userService.update(userId, req.body)
        .then(() => {
            re.sendStatus(200);
        })
        .catch((err) => {
            res.status(400).send(err);
        });
};

function deleteUser(req, res) {
    const userId = req.user.sub;
    if(req.params._id !== userId) {
        return res.status(401).send('You can\'t delete others account'); // denied deleting others accounts
    }

    userService.delete(userId)
        .then(() => {
            res.sendStatus(200);
        })
        .catch((err) => {
            res.status(400).send(err);
        });
};

module.exports = router;