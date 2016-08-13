// app/routes.js
"use strict";
const flash        = require('connect-flash'),
    credentials  = require('./config/credentials'),
    mailService  = require('./lib/email')(credentials),
    bodyParser   = require('body-parser'),
    fs           = require('fs'),
    crypto = require('crypto'),
    moment = require('moment');


module.exports   = function(app, passport,User) {

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
			//console.log(mailService.sendToGroup(['frank25184@icloud.com','ddd@dd.com','djfd@sdf.com'],'subject','this is body'));
		    res.render('home/home', {
		    	fortune: fortuneLib.getFortune() || 'There exist errors',
		    	user: req.user
		    });
		});


		app.get('/about', function(req,res){
		    res.render('home/about',{
		        pageTestScript: '/js/page-test/tests-about.js',//know which test file to be used in this route
		        user: req.user
		    });
		});
		//donot need to add views

		app.get('/cross-browser/hood-river',function(req,res){
		    res.render('cross-browser-test/hood-river',{
		    	user: req.user,
		    });
		});

		app.get('/cross-browser/request-group-rate',function(req,res){
		    res.render('cross-browser-test/request-group-rate',{
		    	user: req.user,
		    });
		});


        
		app.get('/signup',function(req,res){

			//render the page and pass in any flash data if it exists, req.flash is provided by connect-flash
		    res.render('form/signup', { 
	            messages: {
	            	error: req.flash('error'),
	            	success: req.flash('success'),
	            	info: req.flash('info'),
	            }, 
		    	user: req.user,
		    });
		});


		app.get('/login',function(req,res){
			//render the page and pass in any flash data if it exists
		    res.render('form/login', { 
	            messages: {
	            	error: req.flash('error'),
	            	success: req.flash('success'),
	            	info: req.flash('info'),
	            }, 
		    	user: req.user,
		    });
		});



		app.get('/fileupload', function(req,res){
		    var now = new Date();
		    res.render('form/fileupload', {
		        year: now.getFullYear(),
		        month: now.getMonth()//0-11
		    });
		});


	    // we will want this protected so you have to be logged in to visit
	    // we will use route middleware to verify this (the isLoggedIn function)
	    app.get('/user/profile', isLoggedIn, function(req, res) {
	    	const created_at = moment(req.user.local.created_at).format('MMMM Do YYYY, h:mm:ss a');
	        res.render('users/profile', {

	            user : {
	            	id: req.user._id,
	            	username: req.user.local.username,
	            	email: req.user.local.email,
	            	created_at: created_at,
	            	//password: req.user.local.password,


	            },
	            messages: {
	            	error: req.flash('error'),
	            	success: req.flash('success'),
	            	info: req.flash('info'),
	            }, // get the user out of session and pass to template
	        });
	    });


        app.get('/user/updateUser', isLoggedIn, function(req,res){
        	res.render('form/userUpdate', {
 	            user : {
	            	id: req.user._id,
	            	username: req.user.local.username,
	            	email: req.user.local.email,
	            	password: req.user.local.password

	            },
	            messages: {
	            	error: req.flash('error'),
	            	success: req.flash('success'),
	            	info: req.flash('info'),
	            }, // get the user out of session and pass to template	            


        	});
        });

		app.get('/forgotPassword', function(req, res) {
		  res.render('form/resetPw', {
		    user: req.user,
            messages: {
            	error: req.flash('error'),
            	success: req.flash('success'),
            	info: req.flash('info'),
            }, 	    
		  });
		});



		app.get('/reset/:token', function(req, res) {
				User.findOne({ 'local.resetPasswordToken': req.params.token, 'local.resetPasswordExpires': { $gt: Date.now() } }, function(err, user) {
						    if (!user) {
						      req.flash('error', 'Password reset token is invalid or has expired.');
						      res.redirect('/forgotPassword');
						    }
						    res.render('form/resetPwFields', {
								    user: req.user,
						            messages: {
						            	error: req.flash('error'),
						            	success: req.flash('success'),
						            	info: req.flash('info'),
						            },	    
						    });
		        });
		});		

       app.post('/reset/:token', function(req,res){//we do not specify specific action route for the /reset/:token page, so it will use the /reset/:token as its action route
       	  User.findOne({'local.resetPasswordToken': req.params.token, 'local.resetPasswordExpires': { $gt: Date.now() }}, function(err,user){

       	  	   if(!user){
		          req.flash('error', 'Password reset token is invalid or has expired.');
		          return res.redirect('back');
       	  	   }

               user.local.password = user.generateHash(req.body.password);
               user.local.resetPasswordToken = undefined;
               user.local.resetPasswordExpires = undefined;

               user.save(function(err){
               	  if(err){console.log(err);}
               	  req.logIn(user,function(err){
               	  	  mailService.send(user.local.email,'Your password has been changed!', 
                          'Hello,\n\n' + 'This is a confirmation that the password for your account ' + user.local.email + ' has just been changed.\n'
               	  	  	);
               	  });

               });
               req.flash('success', 'Success! Your password has been changed.');
               res.redirect('/user/profile');



       	  });
       });


		app.post('/postForgotPassword', function(req,res){
			//var token;
			//console.log();
			crypto.randomBytes(20, (err, buf) => {
			  if (err) {console.log(err);}

			  
              if(buf){
              	       console.log(`${buf.length} bytes of random data: ${buf.toString('hex')}`);
              	       const token = buf.toString('hex');


			 			console.log(req.body.email);
			            User.findOne({ 'local.email': req.body.email }, function(err, user) {
			                        if(err){console.log(err);}
							        if (!user) {
							          req.flash('error', 'No account with that email address exists.');
							          res.redirect('/forgotPassword');
							        }
							        let expires = Date.now() + 3600000;

							        user.local.resetPasswordToken = token;

							        user.local.resetPasswordExpires = expires; // 1 hour
							        //user.local.password = user.generateHash(req.body.password);
							       // console.log(Date.now().getDate(),Date.now().getTime());

			                        mailService.send(user.local.email, 'Password Reset', 
										          '<p>You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
										          'Please click on the following link, or paste this into your browser to complete the process(the password reset will be invalid in 1 hour ):</p>\n\n' +
										          '<strong> http://' + req.headers.host + '/reset/' + token + '</strong>\n\n' +
										          '<p>If you did not request this, please ignore this email and your password will remain unchanged.</p>\n'

			                        	);
							        user.save(function(err) {
			                            if (err){throw err;}
			                            req.flash('info', 'An e-mail has been sent to ' + user.local.email + ' with further instructions.!');
			                            res.redirect('/login');
			                            //return done(null, user, );

							        });

			             });   

              }

			});


		});

        app.put('/update/updateUser',isLoggedIn, function(req,res){
              
        });        

		app.get('/logout', isLoggedIn,function(req,res){
			req.logout();
			//Passport exposes a logout() function on req (also aliased as logOut()) that can be called from any route handler which needs to terminate a login session. Invoking logout() will remove the req.user property and clear the login session (if any).
			res.redirect('/');
		});


     /*******we can use one of the following for /postSignup:*******/
     /*************/
	    // app.post('/postSignup', passport.authenticate('local-signup', {
	    //     failureRedirect : '/signup', // redirect back to the signup page if there is an error
	    //     failureFlash : true // allow flash messages
	    // }), function(req, res) {

     //       res.render('email/signupMessage',
     //       	   {layout:null, user:req.user}, function(err,html){
     //       	   	   if(err){console.log('err in email template', err);}
     //       	   	   try{
     //       	   	   	  mailService.send(req.user.local.email,'Thanks for your signup!',html);
     //       	   	   }catch(ex){
     //       	   	   	  mailService.mailError('the email widget broke down!', __filename,ex);
     //       	   	   }
                   
     //       	   }

     //       	);
     //       res.render('response/success',{user: req.user});


     //    });

		app.post('/postSignup', function(req, res, next) {
		  passport.authenticate('local-signup', function(err, user, info) {
		    if (err) { return next(err); }
		    if (!user) { return res.redirect('/signup',{message:'Signup fails!'}); }

		    req.logIn(user, function(err) {
		      if (err) { return next(err); }
		      res.render('email/signupMessage',
		           	   {layout:null, user:user}, function(err,html){
		           	   	   if(err){console.log('err in email template', err);}
		           	   	   try{
		           	   	   	  mailService.send(user.local.email,'Thanks for your signup!',html);
		           	   	   }catch(ex){
		           	   	   	  mailService.mailError('the email widget broke down!', __filename,ex);
		           	   	   }
		                   
		           	   }

		      );
		      return res.redirect('/user/profile');

		    });
		  })(req, res, next);
		});        



        app.post('/postLogin', function(req,res,next){
        	passport.authenticate('local-login', function(err, user, info){
				    if (err) { return next(err); }
				    if (!user) { 
				    	req.flash('error','Something wrong with the Password or email!')
				    	return res.redirect('/login'); 
				    }
				    req.logIn(user, function(err) {
				    	if (err) { return next(err); }
				    	
				    	req.flash('success','Login successfully!')
				    	return res.redirect('/user/profile');
 
				    });        		
		    })(req, res, next);
        });
        //getLogin also can use the following too but the above way is flexible
	    // app.post('/getLogin', passport.authenticate('local-login', {
	    //     successRedirect : '/user/profile', // redirect to the secure profile section
	    //     failureRedirect : '/login', // redirect back to the signup page if there is an error
	    //     failureFlash : true // allow flash messages
	    // }));





		app.post("/process/:year/:month", function(req,res){

			let dataDir = __dirname + '/public/data';
			let photoDir = dataDir + '/upload-photo';
			fs.existsSync(dataDir)  || fs.mkdirSync(dataDir);
			fs.existsSync(photoDir) || fs.mkdirSync(photoDir);

            

		    try{
		        //store the data to the database
		        //...
		        console.log('Received contact from ' + req.body.name + " <" + req.body.email + '>' );
		        
		            
		        console.log('the file uploaded: ' , JSON.stringify(req.body));

		        let form = new formidable.IncomingForm();
		        //form.uploadDir = "/public/img";


		        form.parse(req,function(err,fields,files){

		            if(err){return res.redirect(303, '/404');}
		            let photo = files.photo;
		            let dir = photoDir + '/' + Date.now;//prevent uploading file with the same name
                    let path = dir + '/' + photo.name;
                    fs.mkdirSync(dir);
                    fs.renameSync(photo.path, dir + '/' + photo.name);//rename or move the file uploaded;and photo.path is the temp file Formidable give
                    saveFileInfo('upload-photo', fields.email,req.params.year,fields.params.year,fields.params.month,path);

		            console.log('received fields:', fields);
		            console.log('received files:', files.photos.name);
		            //var fileName = (new Date).getTime() + files.photos.name;
		            // fs.rename(files.photos.path+'/',  path.join(__dirname + "/public/img/"), function(err){
		            //     console.log(err);
		            // });



		        });

                req.flash('uploadDone', 'Uploading successfully!')

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
		    res.render('response/success',{message: req.flash('uploadDone')});
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