"use strict";
const flash        = require('connect-flash'),
    config  = require('../config/config'),
    mailService  = require('../lib/email')(config),
    bodyParser   = require('body-parser'),
    formidable = require('formidable'),
    fs           = require('fs'),
    crypto = require('crypto'),
    moment = require('moment'),
    path = require('path');

		exports.signup = function(req,res){

					//render the page and pass in any flash data if it exists, req.flash is provided by connect-flash
				    res.render('form/signup', { 
			            messages: {
			            	error: req.flash('error'),
			            	success: req.flash('success'),
			            	info: req.flash('info'),
			            }, 
				    	user: req.user,
				    });
		};

		exports.login = function(req,res){
					//render the page and pass in any flash data if it exists
				    res.render('form/login', { 
			            messages: {
			            	error: req.flash('error'),
			            	success: req.flash('success'),
			            	info: req.flash('info'),
			            }, 
				    	user: req.user,
				    });
		};

		exports.fileupload = function(req,res){
				    var now = new Date();
				    res.render('form/fileupload', {
			            messages: {
			            	error: req.flash('error'),
			            	success: req.flash('success'),
			            	info: req.flash('info'),
			            },		    	
				        year: now.getFullYear(),
				        month: now.getMonth(),//0-11
				        user: req.user,
			            
				    });
		};


		exports.profile = function(req, res) {
			    	const created_at = moment(req.user.local.created_at).format('MMMM Do YYYY, h:mm:ss a');
			        res.render('users/profile', {

			            user : {
			            	id: req.user._id,
			            	username: req.user.local.username,
			            	email: req.user.local.email,
			            	logo: req.user.local.logo,
			            	created_at: created_at,

			            	//password: req.user.local.password,


			            },
			            messages: {
			            	error: req.flash('error'),
			            	success: req.flash('success'),
			            	info: req.flash('info'),
			            }, // get the user out of session and pass to template
			        });
		};

		exports.updateUser = function(req,res){
		        	res.render('form/userUpdate', {
		 	            user : req.user,
			            messages: {
			            	error: req.flash('error'),
			            	success: req.flash('success'),
			            	info: req.flash('info'),
			            }, // get the user out of session and pass to template	            


		        	});
		};

		exports.forgotPassword = function(req, res) {
				  res.render('form/resetPw', {
				    user: req.user,
		            messages: {
		            	error: req.flash('error'),
		            	success: req.flash('success'),
		            	info: req.flash('info'),
		            }, 	    
				  });
		};

		exports.getResetToken = function(req, res) {
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
		};

		exports.postResetToken = function(req,res){//we do not specify specific action route for the /reset/:token page, so it will use the /reset/:token as its action route
			  
		       	  User.findOne({'local.resetPasswordToken': req.params.token, 'local.resetPasswordExpires': { $gt: Date.now() }}, function(err,user){

		       	  	   if(!user){
				          req.flash('error', 'Password reset token is invalid or has expired.');
				          res.redirect('back');
		       	  	   }
		       	  	   const password = req.body.password;
		               if(password.length < 5){
		               	       req.flash('error', 'Password field must be more than 5 characters!');

		                       res.redirect('err/404');
		               }
		               const newPassword = user.generateHash(password);
		               // user.local.resetPasswordToken = undefined;
		               // user.local.resetPasswordExpires = undefined;
		               //user.local.password = newPassword;
					  const conditions = { 'local.active': true, 'local.email':req.body.email },
					  
					      update = {'local.password':  newPassword,
					             'local.resetPasswordToken': undefined,
					             'local.resetPasswordExpires': undefined},
					      ////$push: {sku: req.body.sku},
					      options = {upsert: true};
					     // console.log('working fine up the update function');
		             
		               ////use user will not work
		               User.update(

		               	  conditions,update,options,
		               	  function(err,raw){
		               	  	console.log('no error in the above of if err');
		               	  	if(err){
		               	  		console.log(err.stack,raw);

		               	  		req.flash('error', 'There was a error processing your request!');
		               	  		res.redirect(303,'/reset/'+ req.params.token);
		               	  	}
		 

			               	  req.logIn(user,function(err){

			               	  	  mailService.send(user.local.email,'Your password has been changed!', 
			                          'Hello,\n\n' + 'This is a confirmation that the password for your account ' + user.local.email + ' has just been changed.\n'
			               	  	  	);
			               	  });

		                    req.flash('success', 'successfully Updated your password!');
		                    res.redirect(303, '/user/profile');
		               	  }
		               	 );

		               // or we can use the following is ok too 
		               //user.save(function(err){
		               // 	  if(err){console.log(err);}
		               // 	  req.logIn(user,function(err){
		               // 	  	  mailService.send(user.local.email,'Your password has been changed!', 
		               //            'Hello,\n\n' + 'This is a confirmation that the password for your account ' + user.local.email + ' has just been changed.\n'
		               // 	  	  	);
		               // 	  });

		               // });
		               // req.flash('success', 'Success! Your password has been changed.');
		               // res.redirect('/user/profile');
		       	  });
		};

		exports.postForgotPassword = function(User){
		       return function(req,res){
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


		      };
		  };

		exports.putUpdateUser = function(req,res){
		              
		};

		exports.logout = function(req,res){
					//req.logout();
					req.session.destroy(function(err){
						  if(err) {
						    console.log(err);
						  } else {
						    res.redirect('/');
						  }				
					});
					//Passport exposes a logout() function on req (also aliased as logOut()) that can be called from any route handler which needs to terminate a login session. Invoking logout() will remove the req.user property and clear the login session (if any).
					// res.redirect('/');
		};



		 /*******we can use one of the following for /postSignup=*******/
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
		exports.postSignup = function(req, res, next) {
				  passport.authenticate('local-signup', function(err, user, info) {
				    if (err) { return next(err); }
				    if (!user) {
				        req.flash('error', 'No such user exists'); 
				    	return res.redirect('/signup'); 
				    }

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
				      req.flash('success','You login successfully and welcome to your dashboard!');
				      return res.redirect('/user/profile');

				    });
				  })(req, res, next);
		};

		exports.postLogin = function(passport){
		    return function(req,res,next){
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
		    };
		 };


		exports.postFileUpload = function(app){
		       return function(req,res){
                    let dataDir;
		            if(app.get('env')=== 'development'){
		            	dataDir = '/Users/frank25184/desktop/nodejs/nodeForm-team/public/data';
		            }else{
		            	dataDir = '/var/www/trver.com/public_html'  + '/public/data';
		            }

					console.log(dataDir);
					const photoDir = dataDir + '/upload-logo';
					//existsSync depreciated!! do not use it any more
					// fs.existsSync(dataDir)  || fs.mkdirSync(dataDir);
					// fs.existsSync(photoDir) || fs.mkdirSync(photoDir);

					//alos can use:
					fs.stat(dataDir, function(err, stat) {
					    if(err == null) {
					        console.log('File exists');
					        return;
					    } else if(err.code == 'ENOENT') {
					        // file does not exist
					        fs.mkdirSync(dataDir);
					        return;
					    } else {
					        console.log('Some other error: ', err.code);
					        return;
					    }
					});

					fs.stat(photoDir, function(err, stat) {
					    if(err == null) {
					        console.log('File exists');
					        return;
					    } else if(err.code == 'ENOENT') {
					        // file does not exist
					        fs.mkdirSync(photoDir);
					        return;
					    } else {
					        console.log('Some other error: ', err.code);
					        return;
					    }
					});			
					// fs.access(dataDir, fs.constants.F_OK, function(err) {
					//     if (!err) {
					//         // Do something
					//         console.log(dataDir + 'the folder exits!')

					//     } else {
					//         // It isn't accessible
					//         fs.mkdirSync(dataDir);
					//     }
					// });
					// fs.access(photoDir, fs.constants.F_OK, function(err) {
					//     if (!err) {
					//         // Do something
					//         console.log(photoDir + 'the folder exits!')

					//     } else {
					//         // It isn't accessible
					//         fs.mkdirSync(photoDir);
					//     }
					// });			
					//fs.constants.F_OK - path is visible to the calling process. This is useful for determining if a file exists, but says nothing about rwx permissions. Default if no mode is specified.
					// fs.constants.R_OK - path can be read by the calling process.
					// fs.constants.W_OK - path can be written by the calling process.
					// fs.constants.X_OK - path can be executed by the calling process. This has no effect on Windows (will behave like fs.constants.F_OK).

		            

				    try{
				        //store the data to the database
				        //...
				        console.info('Received contact from ' + req.user.local.username + " <" + req.user.local.email + '>' );
				        
				            
				        

				        const form = new formidable.IncomingForm();
				        //form.uploadDir = "/public/img";


				        form.parse(req,function(err,fields,file){

				            if(err){return res.redirect(303, '/404');}
				            const photo = file.photo;
				            
				            const timeDir = `${req.params.year}${req.params.month}`;
				            const thedir = photoDir + '/' + timeDir;//prevent uploading file with the same name

							fs.stat(thedir, function(err, stat) {
								console.log('stat parts begins...');
							    if(err == null) {
							        console.log('File exists');
							        return;
							    } else if(err.code == 'ENOENT') {
							        // file does not exist
							        console.log('the file does not exist.now creating...');
							        fs.mkdirSync(thedir);
							       
							        return;
		                            
							    } else {
							        console.log('Some other error: ', err.code);
							        return;
							    }
							});

				            const photoName = Date.now() + photo.name; 
		                    const fullPath = thedir + '/' + photoName;

		                    // if(!dir){
		                    //     fs.mkdirSync(dir);
		                    // }
		                    console.log('the dir is :' + thedir);

		                    
		                    
		                    console.log(photo.name,photo.path,fullPath);

		                     
		                    fs.renameSync(photo.path, fullPath);//rename or move the file uploaded;and photo.path is the temp file Formidable give
		                                     

		                    if(req.user){
			                    function saveFileInfo(){
			                    	
			                    	const user = req.user;
			                    	user.local.logo = timeDir + '/' + phontoName;
			                    	user.save(function(err){
			                    		if(err){throw err}
			                    		req.flash('success','Upload your logo successfully');
			                    	    res.redirect('/user/profile');
			                    	});

			                    }
			                  //  saveFileInfo('upload-photo', fields.email,req.params.year,fields.params.year,fields.params.month,path);
		                    }else{
		                    	console.log('user not login');
		                    	req.flash('eror','You need to login first to upload your logo');
		                    	res.redirect(303, '/login');
		                    }

				            //console.log('received fields:', fields);
				            //console.log('received files:', photo.name);

				        });

		                req.flash('success', 'Uploading successfully!')

				        return res.xhr ? res.render({success: true}) :
				            res.redirect(303, '/success');
				    } catch(ex){
				        return res.xhr ?
				            res.json({error: 'Database error.'}):
				            res.redirect(303, '/error/500');
				    }
		       };

		};












