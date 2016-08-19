// app/routes.js
"use strict";

//let sess;
let main = require('./controllers/main');
let respond = require('./controllers/respond');
let test = require('./controllers/test');
var user = require('./controllers/user');

module.exports   = function(app, passport,User) {
	    

		app.get('/', main.home);
		app.get('/about', main.about);
		//donot need to add views

		app.get('/cross-browser/hood-river',test.hoodRiver);
		app.get('/cross-browser/request-group-rate',test.groupRate);

		app.get('/signup',notLoggedIn, user.signup);
		app.get('/login',notLoggedIn,user.login);
		app.get('/fileupload',isLoggedIn, user.fileupload);
	    // we will want this protected so you have to be logged in to visit
	    // we will use route middleware to verify this (the isLoggedIn function)
	    app.get('/user/profile', isLoggedIn, user.profile);
        app.get('/user/updateUser', isLoggedIn, user.updateUser);
		app.get('/forgotPassword', notLoggedIn, user.forgotPassword);
		app.get('/reset/:token', user.getResetToken);
		app.get('/logout', isLoggedIn,user.logout);	
         
        //404:not found; 400 wrong request;401 not authorized
	    app.get('/success', respond.success);
		app.get('/err/500', respond.Error500);//server error
		app.get('/err/404', respond.Error404);//page not found	

        app.post('/reset/:token', user.postResetToken);
		app.post('/postForgotPassword', user.postForgotPassword(User));
        app.put('/update/updateUser',isLoggedIn, user.putUpdateUser);        
		app.post('/postSignup', user.postSignup);        
        app.post('/postLogin', user.postLogin(passport));

		app.post("/process/:year/:month", user.postFileUpload(app));
		//to get form data using req.body
		/*****form part end********/
};


// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated()){
        return next();
    }
    req.flash('error','You need to login first to access the page!');
    // if they aren't redirect them to the home page
    res.redirect('/');
}

function notLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.user){
	    req.flash('error','You have already logined!');
	    // if they aren't redirect them to the home page
	    res.redirect('/');
    }
    return next();

}