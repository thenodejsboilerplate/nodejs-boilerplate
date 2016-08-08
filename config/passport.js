// config/passport.js
"use strict";
// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;
var bodyParser = require('body-parser');
// load up the user model
var User            = require('../models/User');

// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    // In order to support login sessions, Passport will serialize and deserialize user instances to and from the session.
    //In this example, only the user ID is serialized to the session, keeping the amount of data stored within the session small. When subsequent requests are received, this ID is used to find the user, which will be restored to req.user.
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies(we name it here ourselves) since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {

        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(function() {


                    let username = req.body.username;
                    let passwordConfirmation = req.body.confirmPassword;
                    // User.findOne({'local.username': username}, function(err,user){
                        
                    //     if(user){
                    //         return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
                    //     }

                    
                    // });
                    
                    // find a user whose email is the same as the forms email
                    // we are checking to see if the user trying to login already exists
                    User.findOne({ 'local.email' :  email}, function(err, user) {

                        // if there are any errors, return the error
                        if (err){return done(err);}
                  
                        // check to see if theres already a user with that email
                        if (user) {
                            return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                        } else {
                                        
                                        if(password===passwordConfirmation){
                                                 // if there is no user with that email
                                                // create the user
                                                var newUser            = new User();
                                                // set the user's local credentials
                                                newUser.local.email    = email;
                                                newUser.local.password = newUser.generateHash(password); 

                                                newUser.local.username    = username;

                                                // save the user
                                                newUser.save(function(err) {
                                                    if (err){throw err;}
                                                    return done(null, newUser);
                                                });                                        
                                        }else{
                                            return done(null, false, req.flash('signupMessage', 'Passport does not match!'));
                                        }


                        }

                    });    

        });

    }));
    /***End of signup session setup***/



    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) { // callback with email and password from our form

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'local.email' :  email }, function(err, user) {
            // if there are any errors, return the error before anything else
            if (err){return done(err);}

            // if no user is found, return the message
            if (!user){
                return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
            }

            // if the user is found but the password is wrong
            if (!user.validPassword(password)){
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
            }

            // all is well, return successful user
            return done(null, user);
        });

    }));
 /***End of login session setup***/





};