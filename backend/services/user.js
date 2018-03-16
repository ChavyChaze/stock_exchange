const config = require('config.json');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Q = require('q');
const mongo = require('mongoskin');

const db = mongo.db(process.env.MONGODB_URI || config.connectionString, { w: 1 });
db.bind('users');

const service = {}; // authenticate, getById, create, update, delete: _delete };

service.authenticate = authenticate;
service.getById = getById;
service.create = create;
service.update = update;
service.delete =  _delete;

module.exports = service;

let authenticate = (username, password) => {
    const deferred = Q.defer();

    db.users.findOne({ username }, (err, user) => {
        if(err)
            deferred.reject(err.name + ': ' + err.message);

        if(user && bcrypt.compareSync(password, user.hash)) {
            deferred.resolve(jwt.sign({ sub: user._id }, config.secret)); // authentication success
        } else {
            deferred.resolve(); // authentication fail
        }
    });

    return deferred.promise;
};

let getById = (_id) => {
    const deferred = Q.defer();

    db.user.findById(_id, (err, user) => {
        if(err)
            deferred.reject(err.name + ': ' + err.message);

        if(user) {
            deferred.resolve(_.omit(user, 'hash')); // return user (not hashed password)
        } else {
            deferred.resolve(); // user not found
        }
    });

    return deferred.promise;
};

let create = userParam => {
    const deferred = Q.defer();

    /// Validation
    db.user.findOne( { username: userParam.username }, (err, user) => {
        if(err)
            deferred.reject(err.name + ': ' + err.message);

        if(user) {
            deferred.reject('Username \'' + userParam.username + '\' is already taken');
        } else {
            createUser();
        }
    });

    let createUser = () => {
        let currencyExchange = {
            fp: 1000,
            fpl: 1000,
            pgb: 1000,
            fpc: 1000,
            fpa: 1000,
            dl24: 1000,
        };
        let user = {
            fp: userParam.fp,
            fpl: userParam.fpl,
            pgb: userParam.pgb,
            fpc: userParam.fpc,
            fpa: userParam.fpa,
            dl24: userParam.dl24,
        };

        for(let key in user) {
            user[key] = parseInt(user[key]);
            delete userParam[key];
        }

        userParam.currencyExchange = currencyExchange;
        userParam.user = user;
        userParam.value = parseInt(userParam.value);

        // setting user to userParam
        user = _.omit(userParam, 'password');

        // adding hash password to user
        user.hash = bcrypt.hashSync(userParam.password, 10);

        db.users.insert(user, (err, doc) => {
            if(err)
                deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });
    };

    return deffered.promise;
};

let update = (_id, userParam) => {
    const deffered = Q.defer();

    /// Validation
    db.users.findById(_id, (err, user) => {
        if(err)
            deferred.reject(err.name + ': ' + err.message);

        if(user.username !== userParam.username) {
            // check if username (to change) is free
            db.users.findOne({ username: userParam.username }, (err, user) => {
                if(err)
                    deffered.reject(err.name + ': ' + err.message);
                
                    if(user) {
                        // username is taken
                        deffered.reject('Username \'' + req.body.username + '\' is already taken');
                    } else {
                        updateUser();
                    }
            });
        } else {
            updateUser();
        }
    });

    let updateUser = () => {
        const set = {
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

        // update password if inputed
        if(userParam.password) 
            set.hash = bcrypt.hashSync(userParam.password, 10);
        
        db.user.update(
            { _id: mongo.helper.toObjectID(_id) },
            { $set: set },
            (err, doc) => {
                if(err)
                    deferred.reject(err.name + ': ' + err.message);

                deffered.resolve();
            }
        );
    };

    return deffered.promise;
};

let _delete = (_id) => {
    const deffered = Q.defer();

    db.user.remove({ _id: mongo.helper.toObjectID(_id) }, err => {
        if(err)
            deffered.reject(err.name + ': ' + err.message);

        deffered.resolve();
    });

    return deffered.promise;
};