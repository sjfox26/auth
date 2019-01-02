const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

//Create local strategy
const localOptions = { usernameField: 'email' };
const localLogin = new LocalStrategy(localOptions, function(email, password, done) {
    //Verify the email and password
    //Call done if it is the correct email and password
    //otherwise, call done with false
    User.findOne({ email: email }, function(err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false); }

        //compare passwords- is password (from arg) equal to user.password?
        user.comparePassword(password, function(err, isMatch) {
            if (err) { return done(err); }
            if (!isMatch) { return done(null, false); }

            return done(null, user);

        });
    });
});

//Setup options for JWT Strategy
const JwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: config.secret
};

//Create JWT Strategy- payload is decoded JWT token, done is a callback method
const jwtLogin = new JwtStrategy(JwtOptions, function(payload, done) {

    //See if the user ID in the payload exists in our database
    //If it does, call done with that user
    //If not, call done without a user object
    User.findById(payload.sub, function(err, user) {
        if (err) { return done(err, false); }

        if (user) {
            done(null, user);
        } else {
            done(null, false);
        }

    });

});

//Tell Passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);