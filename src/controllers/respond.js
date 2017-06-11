"use strict";
module.exports ={
		success: (req,res)=>{
				res.render('response/success',{
					messages: {
						error: req.flash('error'),
						success: req.flash('success'),
						info: req.flash('info'),
					}, 
					user: req.user ? req.user.processUser(req.user) : req.user,				
				});
		},

		//500 server error
		Error500: (req,res)=>{
				res.render('response/500',{
					messages: {
						error: req.flash('error'),
						success: req.flash('success'),
						info: req.flash('info'),
					}, 
					user: req.user ? req.user.processUser(req.user) : req.user,			
				});
		},

		//404 original page is not found
		Error404: (req,res)=>{
				res.render('response/404',{
					messages: {
						error: req.flash('error'),
						success: req.flash('success'),
						info: req.flash('info'),
					}, 
					user: req.user ? req.user.processUser(req.user) : req.user,			
				});
		},

		
};


//exports...
