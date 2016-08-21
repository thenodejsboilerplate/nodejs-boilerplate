// app/routes.js
"use strict";

//let sess;
let main = require('./controllers/main'),
    respond = require('./controllers/respond'),
    test = require('./controllers/test'),
    user = require('./controllers/user'),
    auth = require('./middlewares/auth');

module.exports   = function(app, passport,User) {
	    

		app.get('/', main.home);
		app.get('/about', main.about);
		//donot need to add views

		app.get('/cross-browser/hood-river',test.hoodRiver);
		app.get('/cross-browser/request-group-rate',test.groupRate);

		app.get('/signup',auth.notLoggedIn, user.signup);
		app.get('/login',auth.notLoggedIn,user.login);
		app.get('/fileupload',auth.isLoggedIn, user.fileupload);
	    // we will want this protected so you have to be logged in to visit
	    // we will use route middleware to verify this (the isLoggedIn function)
	    app.get('/user/profile', auth.isLoggedIn, user.profile);
        app.get('/user/updateUser', auth.isLoggedIn, user.updateUser);
		app.get('/forgotPassword', auth.notLoggedIn, user.forgotPassword);
		app.get('/reset/:token', user.getResetToken);
		app.get('/logout', auth.isLoggedIn,user.logout);	





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
        app.get('/auth/google', passport.authenticate('google', { scope : ['https://www.googleapis.com/auth/plus.login'] }));
 
 	    // the callback after google has authenticated the user
 	    app.get('/auth/google/callback',
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
		app.get('/auth/github',
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
		app.get('/auth/github/callback', 
		  passport.authenticate('github', { failureRedirect: '/login' }),
		  function(req, res) {
		  	req.flash('success','You login successfully using github,and your password is the same as your username!');
		    res.redirect('/');
		  });








        //404:not found; 400 wrong request;401 not authorized
	    app.get('/success', respond.success);
		app.get('/err/500', respond.Error500);//server error
		app.get('/err/404', respond.Error404);//page not found	

        app.post('/reset/:token', user.postResetToken);
		app.post('/postForgotPassword', user.postForgotPassword(User));
        app.put('/update/updateUser',auth.isLoggedIn, user.putUpdateUser);        
		app.post('/postSignup', user.postSignup(passport));        
        app.post('/postLogin', user.postLogin(passport));

		app.post("/process/:year/:month", user.postFileUpload(app));
		//to get form data using req.body
		/*****form part end********/
};
