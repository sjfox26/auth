const jwt = require('jwt-simple');
const User = require('../models/user');
const config = require('../config');

function tokenForUser(user) {
    const timestamp = new Date().getTime();
    return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}

exports.signin = function(req, res, next) {
    //User has already had their email and password authenticated
    //We just need to give them a token
    res.send({ token: tokenForUser(req.user) });
}

exports.signup = function(req, res, next) {
    //res.send({ success: true });

    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
        return res.status(422).send({ error: 'You must provide email and password.'})
        //potential add: validate email format
    }

    //See if a user with the given email exists
    User.findOne({ email: email }, function(err, existingUser) {
        if (err) { return next(err); }

        //If user with email already exists, return an error
        if (existingUser) {
            return res.status(422).send({ error: 'Email is already in use' })
        }

        //If it's a fresh email, create and save user record
        const user = new User({
            email: email,
            password: password
        });

        user.save(function(err) {
            if (err) { return next(err); }

            //Respond to request indicating that the user was created
            //res.json(user);
            res.json({ token: tokenForUser(user) });

        });

    });




}