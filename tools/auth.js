const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const userModel = require('../models/userModel');
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const fetch = require("node-fetch");
var apiRequest = require('./apiRequest.js');
require('dotenv').config();
//var config = require('../config.json');

var cookieExtractor = function (req) {
    var token = null;
    if (req && req.cookies) token = req.cookies['jwt'];
    return token;
};

var headerExtractor = function (req) {
    var token = null;
    if (req.headers['authorization']) {
        token = req.headers['authorization'].split(' ')[1];
    }
    return token;
};

passport.use(
    new JWTstrategy({
            secretOrKey: process.env.API_KEY,
            jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor, headerExtractor])
        },
        async (token, done) => {
            try {
                return done(null, token.user);
            } catch (error) {
                done(error);
            }
        }
    )
);


passport.use(
    'register',
    new localStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        async (req, username, password, done) => {
            try {
                var user = new userModel();
                user.email = req.body.email;
                user.password = req.body.password;
                user.displayName = req.body.displayName;
                user.userRole = req.body.userRole;

                console.log("user in localStrategy");
                console.log(user);

                let createdUser = await user.save().catch(err => done(err));

                console.log("createdUser");
                console.log(createdUser);

                return done(null, createdUser);
            } catch (error) {
                console.log(error)
                done(error);
            }
        }
    )
);

passport.use(
    'login',
    new localStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        async (req, email, password, done) => {
            try {
                const user = await userModel.findOne({email});

                if (!user) {
                    return done(null, false, {
                        message: 'User not found'
                    });
                }

                const validate = await user.isValidPassword(password);

                if (!validate) {
                    return done(null, false, {
                        message: 'Wrong Password'
                    });
                }

                return done(null, user, {
                    message: 'Logged in Successfully'
                });
            } catch (error) {
                return done(error);
            }
        }
    )
);

async function createNewUser(email, password, displayName, userRole) {

    var user = new userModel();
    user.email = email;
    user.password = password;
    user.displayName = displayName;
    user.userRole = userRole;

    await user.save(function (err) {
        if (err){
            return({errors: err});
        }
        console.log("user in createNewUser");
        console.log(user);
        return user;
    });  
}