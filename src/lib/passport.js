// config/passport.js
'use strict';
// load all the things we need
const LocalStrategy = require('passport-local').Strategy;

// load the auth variables
const configAuth = require('../config/auth');

// load up the user model
const User = require('../models/User');
const logger = require('./logger');
const validator = require('validator'),
  xss = require('xss');
// expose this function to our app using module.exports
module.exports = function (passport) {
    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session;
    // In order to support login sessions, Passport will serialize and deserialize user instances to and from the session.
    // In this example, only the user ID is serialized to the session, keeping the amount of data stored within the session small. When subsequent requests are received, this ID is used to find the user, which will be restored to req.user.
    // essentially it allows you to stay logged-in when navigating between different pages within your application.
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

    // used to deserialize the user
  passport.deserializeUser((id, done) => {
    User.findById(id, function (err, user) {
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
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true // allows us to pass back the entire request to the callback
  },
        function (req, email, password, done) {
            // asynchronous
            // User.findOne wont fire unless data is sent back
          process.nextTick(function () {
            const username = validator.trim(xss(req.body.username));
            const passwordConfirmation = validator.trim(xss(req.body.confirmPassword));

            User.findOne({ 'local.username': username }, (err, user) => {
              if (err) {
                logger.error('there is error existing' + err);
                return done(err);
              } else {
                if (user) {
                  console.log('the username is already token');
                  return done(null, false, req.flash('error', '用户名已被占用.'));
                } else {
                  logger.debug('the username can be used');
                            // find a user whose email is the same as the forms email
                            // we are checking to see if the user trying to login already exists
                  User.findOne({ 'local.email': email }, function (err, user) {
                                // if there are any errors, return the error
                    if (err) { return done(err); }

                                // check to see if theres already a user with that email
                    if (user) {
                      return done(null, false, req.flash('error', '邮箱已被占用！'));
                    } else {
                      if (passwordConfirmation === password) {
                                        // if there is no user with that email
                                        // create the user
                        let newUser = new User();

                                        // set the user's local credentials
                        newUser.local.email = email;
                        newUser.local.password = newUser.generateHash(password);
                        newUser.local.username = username;
                        if (req.body.course) {
                          newUser.local.interestedCourse = req.body.course;
                                            // console.log(`req.body.course ${req.body.course}`);
                        }

                                        // save the user
                        newUser.save(function (err) {
                          if (err) { throw err; }
                          return done(null, newUser);
                        });
                      } else {
                        return done(null, false, req.flash('error', '两次密码不符!'));
                      }
                    }
                  });
                }
              }
            });
          });
        }));
    /** *End of signup session setup***/

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

  passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true // allows us to pass back the entire request to the callback
  },
        function (req, email, password, done) {
 // callback with email and password from our form

            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
          User.findOne({ 'local.email': email }, function (err, user) {
                // if there are any errors, return the error before anything else
            if (err) { return done(err); }

                // if no user is found, return the message
            if (!user) {
              return done(null, false, req.flash('error', '没有此用户')); // req.flash is the way to set flashdata using connect-flash
            }

                // if the user is found but the password is wrong

            if (!user.validPassword(password)) {
              return done(null, false, req.flash('error', '密码错误')); // create the loginMessage and save it to session as flashdata
            }

                // all is well, return successful user
            return done(null, user);
          });
        }));
    /** *End of login session setup***/
};
