const config = require('./../../config.json');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Q = require('q');
const mongo = require('mongoskin');
const db = mongo.db(process.env.MONGODB_URI || config.connectionString); // heroku config
db.bind('users');

let service = {};

service.authenticate = authenticate;
service.getById = getById;
service.create = create;
service.update = update;
service.delete = _delete;

module.exports = service;

function authenticate(username, password) {
    const deferred = Q.defer();

    db.users.findOne({ username: username }, function (err, user) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (user && bcrypt.compareSync(password, user.hash)) {
            deferred.resolve(jwt.sign({ sub: user._id }, config.secret)); // authentication successful
        } else {
            deferred.resolve(); // authentication failed
        }
    });

    return deferred.promise;
}

function getById(_id) {
    const deferred = Q.defer();

    db.users.findById(_id, function (err, user) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (user) {
            deferred.resolve(_.omit(user, 'hash')); // return user (without hashed password)
        } else {
            deferred.resolve(); // user not found
        }
    });

    return deferred.promise;
}

function create(userParam) {
    const deferred = Q.defer();

    db.users.findOne( // validation
        { username: userParam.username },
        function (err, user) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            if (user) {
                deferred.reject('Username "' + userParam.username + '" is already taken'); // username already exists
            } else {
                createUser();
            }
        });

    function createUser() {
        let currencyExchange = {
            fp: 500,
            fpl: 500,
            pgb: 500,
            fpc: 500,
            fpa: 500,
            dl24: 500
        };
        let user = {
            fp: userParam.fp,
            fpl: userParam.fpl,
            pgb: userParam.pgb,
            fpc: userParam.fpc,
            fpa: userParam.fpa,
            dl24: userParam.dl24
        };

        for (key in user) {
            user[key] = parseInt(user[key])
            delete userParam[key]
        }

        userParam.currencyExchange = currencyExchange;
        userParam.user = user;
        userParam.value = parseInt(userParam.value);

        user = _.omit(userParam, 'password'); // set user object to userParam

        user.hash = bcrypt.hashSync(userParam.password, 10); // add hashed password to user object

        db.users.insert(
            user,
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}

function update(_id, userParam) {
    const deferred = Q.defer();

    db.users.findById(_id, function (err, user) { // validation
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (user.username !== userParam.username) {
            db.users.findOne( // check if username is available
                { username: userParam.username },
                function (err, user) {
                    if (err) deferred.reject(err.name + ': ' + err.message);

                    if (user) {                        
                        deferred.reject('Username "' + req.body.username + '" is already taken'); // username already exists
                    } else {
                        updateUser();
                    }
                });
        } else {
            updateUser();
        }
    });

    function updateUser() {        
        let set = { // fields to update
            firstName: userParam.firstName,
            lastName: userParam.lastName,
            username: userParam.username,
            value: userParam.value,
            currencyExchange: {
                fp: userParam.currencyExchange.fp,
                fpl: userParam.currencyExchange.fpl,
                pgb: userParam.currencyExchange.pgb,
                fpc: userParam.currencyExchange.fpc,
                fpa: userParam.currencyExchange.fpa,
                dl24: userParam.currencyExchange.dl24
            },
            user: {
                fp: userParam.user.fp,
                fpl: userParam.user.fpl,
                pgb: userParam.user.pgb,
                fpc: userParam.user.fpc,
                fpa: userParam.user.fpa,
                dl24: userParam.user.dl24
            }
        };
        
        if (userParam.password) { // update password if it was entered
            set.hash = bcrypt.hashSync(userParam.password, 10);
        }

        db.users.update(
            { _id: mongo.helper.toObjectID(_id) },
            { $set: set },
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}

function _delete(_id) {
    const deferred = Q.defer();

    db.users.remove(
        { _id: mongo.helper.toObjectID(_id) },
        function (err) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}