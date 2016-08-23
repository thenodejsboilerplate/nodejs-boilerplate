		
 "use strict";
 const express = require('express');
const router = express.Router();

 module.exports = function(app,User,passport){
     
        // =====================================
		// GOOGLE ROUTES =======================
		// =====================================
		// send to google to do the authentication
		// profile gets us their basic information including their name
		// email gets their emails
		//../plus.login/ below is the recommended login scope providing access to social features. This scope implicitly includes the profile scope and also requests that your app be given access to:
		// 1 the age range of the authenticated user
		// 2 the list of circled people that the user has granted your app access to know
		// 3 the methods for reading, writing and deleting app activities (moments) to Google on behalf of the user
		// In addition, this scope enables cross-platform single sign-on.
      router.get('/google', passport.authenticate('google', { scope : ['https://www.googleapis.com/auth/plus.login'] }));
 
 	    // the callback after google has authenticated the user
 	    router.get('/google/callback',
 	            passport.authenticate('google', {
 	                    failureRedirect : '/login'
 	                    //successRedirect : '/'
 	            }),
			  function(req, res) {
			  	req.flash('success','You login successfully using github,and your password is the same as your username!');
			    res.redirect('/');
			  }
 	            
 		);


		// =====================================
		// GITHUB ROUTES =======================
		// =====================================
		// GET /auth/github
		//   Use passport.authenticate() as route middleware to authenticate the
		//   request.  The first step in GitHub authentication will involve redirecting
		//   the user to github.com.  After authorization, GitHub will redirect the user
		//   back to this application at /auth/github/callback
		router.get('/github',
		  passport.authenticate('github', { scope: [ 'user:email' ] }),
		  function(req, res){
		    // The request will be redirected to GitHub for authentication, so this
		    // function will not be called.
		  });

		// GET /auth/github/callback
		//   Use passport.authenticate() as route middleware to authenticate the
		//   request.  If authentication fails, the user will be redirected back to the
		//   login page.  Otherwise, the primary route function will be called,
		//   which, in this example, will redirect the user to the home page.
		router.get('/github/callback', 
		  passport.authenticate('github', { failureRedirect: '/login' }),
		  function(req, res) {
		  	req.flash('success','You login successfully using github,and your password is the same as your username!');
		    res.redirect('/');
		  });
 }       
        
