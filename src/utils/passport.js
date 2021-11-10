require('dotenv').config();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const bcrypt = require('bcryptjs');
const User = require('../models/User');

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, (email, password, done) => {
    User.findOne({email}, (err, user) => {
        if(err){
            return done(err);
        }
        if(!user){
            return done(null, false, { message: "This user does not exist"});
        }

        bcrypt.compare(password, user.password, (err, match) => {
            if(err){
                return done(err);
            }
            if(!match){
                return done(null, false, {message: 'Incorrect Password'});
            }
            return done(null, user, {message: 'Logged In successfully'})
        });
    }) 
}))

passport.use(
    new JWTStrategy(
        {
            jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET
        }, (jwtPayload, done) => {
            return done(null, jwtPayload);
        }
));


module.exports = passport;