// app/routes.js
"use strict";
var flash    = require('connect-flash');
module.exports = function(app, passport,User) {

		// app.get('/no-layout',function(req,res){
		//     res.render('no-layout',{layout:null});
		// });
		//if you do not want to use layout

		// app.get('/custom-layout',function(req,res){
		//     res.render('custom-layout',{layout: 'custom'});
		// });
		//if you want another layout
		let fortuneLib = require(__dirname + '/lib/fortune.js');


		app.get('/', function(req,res){
		    res.render('home/home', {fortune: fortuneLib.getFortune() || 'There exist errors'});
		});


		app.get('/about', function(req,res){
		    res.render('home/about',{
		        pageTestScript: '/js/page-test/tests-about.js'//know which test file to be used in this route
		    });
		});
		//donot need to add views

		app.get('/cross-browser/hood-river',function(req,res){
		    res.render('cross-browser-test/hood-river');
		});

		app.get('/cross-browser/request-group-rate',function(req,res){
		    res.render('cross-browser-test/request-group-rate');
		});


        
		app.get('/signup',function(req,res){

			//render the page and pass in any flash data if it exists
		    res.render('form/signup', { message: req.flash('signupMessage')});
		});


		app.get('/login',function(req,res){
			//render the page and pass in any flash data if it exists
		    res.render('form/login', { message: req.flash('loginMessage')});
		});

	    // we will want this protected so you have to be logged in to visit
	    // we will use route middleware to verify this (the isLoggedIn function)
	    app.get('/profile', isLoggedIn, function(req, res) {
	        res.render('users/profile', {
	            user : req.user // get the user out of session and pass to template
	        });
	    });


		app.get('/logout', function(req,res){
			req.logout();
			//Passport exposes a logout() function on req (also aliased as logOut()) that can be called from any route handler which needs to terminate a login session. Invoking logout() will remove the req.user property and clear the login session (if any).
			res.redirect('/');
		});



	    app.post('/postSignup', passport.authenticate('local-signup', {
	        successRedirect : '/profile', // redirect to the secure profile section
	        failureRedirect : '/signup', // redirect back to the signup page if there is an error
	        failureFlash : true // allow flash messages
	    }));


	    app.post('/postLogin', passport.authenticate('local-login', {
	        successRedirect : '/profile', // redirect to the secure profile section
	        failureRedirect : '/login', // redirect back to the signup page if there is an error
	        failureFlash : true // allow flash messages
	    }));



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
	                    failureRedirect : '/login',
	                    successRedirect : '/'
	            })
	            
		);



		app.get('/submit-info', function(req,res){
		    var now = new Date();
		    res.render('form/submit-info', {
		        year: now.getFullYear(),
		        month: now.getMonth()//0-11
		    });
		});

		app.post("/process/:year/:month", function(req,res){

		    try{
		        //store the data to the database
		        //...
		        console.log('Received contact from ' + req.body.name + " <" + req.body.email + '>' );
		        
		            
		        console.log('the file uploaded: ' , JSON.stringify(req.body));

		        let form = new formidable.IncomingForm();
		        //form.uploadDir = "/public/img";


		        form.parse(req,function(err,fields,files){

		            if(err){return res.redirect(303, '/404');}
		            console.log('received fields:', fields);
		            console.log('received files:', files.photos.name);
		            var fileName = (new Date).getTime() + files.photos.name;
		            // fs.rename(files.photos.path+'/',  path.join(__dirname + "/public/img/"), function(err){
		            //     console.log(err);
		            // });

		        });


		        return res.xhr ? res.render({success: true}) :
		            res.redirect(303, '/success');
		    } catch(ex){
		        return res.xhr ?
		            res.json({err: 'Database error.'}):
		            res.redirect(303, '/db-error');
		    }
		});
		//to get form data using req.body


		app.get('/success', function(req,res){
		    res.render('response/success');
		});
		app.get('/de-error', function(req,res){
		    res.render('errors/db-error');
		});
		/*****form part end********/
};







// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated()){
        return next();
    }

    // if they aren't redirect them to the home page
    res.redirect('/');
}


// app.get('/no-layout',function(req,res){
//     res.render('no-layout',{layout:null});//or layout:false
// });
//if you do not want to use layout

// app.get('/custom-layout',function(req,res){
//     res.render('custom-layout',{layout: 'custom'});
// });
//if you want another layout