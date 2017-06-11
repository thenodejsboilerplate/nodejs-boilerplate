"use strict";
const flash        = require('connect-flash'),
    config  = require('../common/get-config'),
    mailService  = require('../lib/mail')(config),
    bodyParser   = require('body-parser'),
    formidable = require('formidable'),
    crypto = require('crypto'),
    moment = require('moment'),
    path = require('path'),
    fs = require('fs'),
	utils = require('../lib/utility'),
	Post = require('../models/Post'),
	User = require('../models/User'),
	postProxy = require('../db_proxy/post');

module.exports = {

		signup: (req,res)=>{
					//render the page and pass in any flash data if it exists, req.flash is provided by connect-flash
				    res.render('form/signup', { 
			            messages: {
			            	error: req.flash('error'),
			            	success: req.flash('success'),
			            	info: req.flash('info'),
			            }, 
				    	user: req.user ? req.user.processUser(req.user) : req.user,
				    });
		},

		login: (req,res)=>{
					//render the page and pass in any flash data if it exists
				    res.render('form/login', { 
			            messages: {
			            	error: req.flash('error'),
			            	success: req.flash('success'),
			            	info: req.flash('info'),
			            }, 
				    	user: req.user ? req.user.processUser(req.user) : req.user,
				    });
		},

		fileupload: (req,res)=>{
				    var now = new Date();
				    res.render('form/fileupload', {
			            messages: {
			            	error: req.flash('error'),
			            	success: req.flash('success'),
			            	info: req.flash('info'),
			            },		    	
				        year: now.getFullYear(),
				        month: now.getMonth(),//0-11
				        user: req.user ? req.user.processUser(req.user) : req.user,
			            
				    });
		},


		profile: (req, res)=> {
				    const user_id = req.params.user_id;
                    postProxy.getPostsByUserId(req,res,user_id,'users/profile');
		},

		updateUser: (req,res)=>{
		        	res.render('form/userUpdate', {
		 	            user : req.user ? req.user.processUser(req.user) : req.user,
			            messages: {
			            	error: req.flash('error'),
			            	success: req.flash('success'),
			            	info: req.flash('info'),
			            }, // get the user out of session and pass to template	            


		        	});
		},

		forgotPassword: (req, res)=> {
				  res.render('form/resetPw', {
				    user: req.user ? req.user.processUser(req.user) : req.user,
		            messages: {
		            	error: req.flash('error'),
		            	success: req.flash('success'),
		            	info: req.flash('info'),
		            }, 	    
				  });
		},

		getResetToken: (req, res)=> {
						User.findOne({ 'local.resetPasswordToken': req.params.token, 'local.resetPasswordExpires': { $gt: Date.now() } }, (err, user)=> {
								    if (!user) {
								      req.flash('error', 'Password reset token is invalid or has expired.');
								      res.redirect('/user/forgotPassword');
								    }
								    res.render('form/resetPwFields', {
										    user: req.user ? req.user.processUser(req.user) : req.user,
								            messages: {
								            	error: req.flash('error'),
								            	success: req.flash('success'),
								            	info: req.flash('info'),
								            },	    
								    });
				        });
		},

		postResetToken: (req,res)=> {//we do not specify specific action route for the /reset/:token page, so it will use the /reset/:token as its action route
			  						
			      const promis = new Promise(function(resolve,reject){
						// console.log('working fine up the update function');
						User.findOne({'local.resetPasswordToken': req.params.token, 'local.resetPasswordExpires': { $gt: Date.now() }}, function(err,user){
							if(!user){
								reject(`Password reset token is invalid or has expired`);
							}else{
								resolve(user);
							}
					   });
				  });

				  promis.then(function(user){

						const password = req.body.password;
						if(password.length < 5){
								req.flash('error', 'Password field must be more than 5 characters!');

								res.redirect('response/err/404');
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


		               ////use user will not work
		               User.update(
		               	  conditions,update,options,
		               	  (err,raw)=>{
		               	  	console.log('no error in the above of if err');
		               	  	if(err){
		               	  		console.log(err.stack,raw);
		               	  		req.flash('error', 'There was a error processing your request!');
		               	  		res.redirect(303,'/user/reset/'+ req.params.token);
		               	  	}
							req.logIn(user, err=>{

								mailService.send(user.local.email,'Your password has been changed!', 
									'Hello,\n\n' + 'This is a confirmation that the password for your account ' + user.local.email + ' has just been changed.\n'
								);
							});

		                    req.flash('success', 'successfully Updated your password!');
		                    res.redirect(303, '/user/profile');
		               	  }
		             );					  
				  }).
				  catch(function(err){
						console.log('error', err);
						flash('error',err);
						res.redirect('back');
				  });

		             

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
		       	 
		},

		postForgotPassword: User=>{
		       return function(req,res){
					//var token;
					//console.log();
					crypto.randomBytes(20, (err, buf) => {
					  if (err) {console.log(err);}

					  
		              if(buf){
		              	       console.log(`${buf.length} bytes of random data: ${buf.toString('hex')}`);
		              	       const token = buf.toString('hex');


					 			console.log(req.body.email);
					            User.findOne({ 'local.email': req.body.email }, (err, user)=> {
					                        if(err){console.log(err);}
									        if (!user) {
									          req.flash('error', 'No account with that email address exists.');
									          res.redirect('/user/forgotPassword');
									        }
									        let expires = Date.now() + 3600000;

									        user.local.resetPasswordToken = token;

									        user.local.resetPasswordExpires = expires; // 1 hour
									        //user.local.password = user.generateHash(req.body.password);
									       // console.log(Date.now().getDate(),Date.now().getTime());

					                        mailService.send(user.local.email, 'Password Reset', 
												          '<p>You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
												          'Please click on the following link, or paste this into your browser to complete the process(the password reset will be invalid in 1 hour ):</p>\n\n' +
												          '<strong> http://' + req.headers.host + '/user/reset/' + token + '</strong>\n\n' +
												          '<p>If you did not request this, please ignore this email and your password will remain unchanged.</p>\n'

					                        	);
									        user.save(err=> {
					                            if (err){throw err;}
					                            req.flash('info', 'An e-mail has been sent to ' + user.local.email + ' with further instructions.!');
					                            res.redirect('/user/login');
					                            //return done(null, user, );

									        });

					             });   

		              }

					});


		      };
		},

		putUpdateUser: User=>{
		       return function(req,res){
		            let   locals    = req.user.local, 
					      username = locals.username,
					      email    = locals.email;
							User.findOne({ 'local.email': email }, (err, user)=> {
										if(err){console.log(err);return;}
										if (!user) {
											req.flash('error', 'Your logined user\'s email seems not found in our system! Please logout and login again!');
											res.redirect('/user/login');
										}else{
												user.local.username = req.body.username;
												user.local.email = req.body.email;
												mailService.send(user.local.email, 'User Upadate', 
																'<p>You have successfully update your information!</p>'+
																'Your new username:'+ req.body.username +'/n'+
																'Your new email:' + req.body.email
												);
												user.save(err=> {
													if (err){throw err;}
													req.flash('success', 'You have successfully update your information!');
													res.redirect('/user/profile');
													//return done(null, user, );

												});											
										}



								}); 
				    
					
		        };
		},


		logout: (req,res)=>{
					//req.logout();
					req.session.destroy(err=>{
						  if(err) {
						    console.log(err);
						  } else {
						    res.redirect('/');
						  }				
					});
					//YOU CAN ALSO USE REQ.LOGOUT() IF YOU DO NOT USE REDIS
					//Passport exposes a logout() function on req (also aliased as logOut()) that can be called from any route handler which needs to terminate a login session. Invoking logout() will remove the req.user property and clear the login session (if any).
					// res.redirect('/');
		},



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
		postSignup: passport=>{

		     return function(req, res, next) {
				  passport.authenticate('local-signup', (err, user, info)=> {
				    if (err) { return next(err); }else{
								if (!user) {
									//req.flash('error', 'No such user exists'); 
									return res.redirect('/user/signup'); 
								}else{
										req.logIn(user, err=> {
												if (err) { return next(err); }
												res.render('email/signupMessage',
														{layout:null, user:user}, (err,html)=>{
															if(err){console.log('err in email template', err);}
															try{
																mailService.send(user.local.email,'Thanks for your signup!',html);
															}catch(ex){
																mailService.mailError('the email widget broke down!', __filename,ex);
															}
															
														}

												);
												req.flash('success','You login successfully and welcome to your dashboard!');
												return res.redirect('/user/profile/'+ user._id);

										});
								}

					}

					

				  })(req, res, next);
		     };
 
        },

		postLogin: function(passport){
		    return function(req,res,next){
		        	passport.authenticate('local-login', (err, user, info)=>{
						    if (err) { return next(err); }
						    if (!user) { 
						    	req.flash('error','Something wrong with the Password or email!')
						    	return res.redirect('/user/login'); 
						    }
						    req.logIn(user, function(err) {
						    	if (err) { return next(err); }
						    	
						    	req.flash('success','Login successfully!')
						    	return res.redirect('/user/profile/'+user._id);
		 
						    });        		
				    })(req, res, next);
		    };
		 },


		postFileUpload: app=>{
		       return function(req,res){
                    let dataDir = config.uploadDir;
		            // if(app.get('env')=== 'development' || app.get('env')=== 'test'){
		            	//dataDir = config.uploadDir;
		            // }else{
		            // 	dataDir = config.uploadDir.production;
		            // }

					console.log(dataDir);
					let photoDir = dataDir + 'logo/';
					//existsSync depreciated!! do not use it any more
					// fs.existsSync(dataDir)  || fs.mkdirSync(dataDir);
					// fs.existsSync(photoDir) || fs.mkdirSync(photoDir);

					//also can use:
                    utils.checkDir(dataDir);
					utils.checkDir(photoDir);		
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
				        //console.info('Received contact from ' + req.user.local.username + " <" + req.user.local.email + '>' );
				        
				        const form = new formidable.IncomingForm();

				        form.parse(req,(err,fields,file)=>{

				            if(err){
									req.flash('error','form parse error:' + err);
									return res.redirect(500, '/response/err/500');
							}else{
									const photo = file.photo;
									
									let personalDir = `${req.user._id}/`;
									let thedir = photoDir + personalDir;
									//prevent uploading file with the same name



									const photoName = req.user._id + photo.name; 
									
									const fullPath = thedir + photoName;

									//checkDir need to be passed to have a callback so that the thedir is generated before the rename function being called
									utils.checkDir(thedir,()=>{
										fs.rename(photo.path, fullPath, err=>{
											if (err) {console.log(err); return; }
											console.log('The file has been re-named to: ' + fullPath);
										});										
									});

									console.log('the dir is :' + thedir);
									console.log(photo.name,photo.path,fullPath);
                                    
									//rename or move the file uploaded;and photo.path is the temp file Formidable give
													
									if(req.user){
										function saveFileInfo(){
											
											const user = req.user;
											user.local.logo = photoName;
											user.save(err=>{
												if(err){throw err}
												req.flash('success','Upload your logo successfully');
												res.redirect('/user/profile/'+ user._id);
											});

										}
										saveFileInfo();
										// req.flash('success', 'Uploading successfully!');
										// return res.xhr ? res.json({success: true}) :
										// res.redirect(303, '/success');
									//  saveFileInfo('upload-photo', fields.email,req.params.year,fields.params.year,fields.params.month,path);
									}else{
										console.log('user not login');
										req.flash('eror','You need to login first to upload your logo');
										res.redirect(303, '/user/login');
									}								
							}


				            //console.log('received fields:', fields);
				            //console.log('received files:', photo.name);

				        });


				    } catch(ex){
				        return res.xhr ?
				            res.json({error: 'Database error.'}):
				            res.redirect(303, '/response/error/500');
				    }
		       };

		},




};//end of exports
