"use strict";

exports.success = (req,res)=>{
        res.render('response/success',{
	        messages: {
	        	error: req.flash('error'),
	        	success: req.flash('success'),
	        	info: req.flash('info'),
	        }, 
	    	user: req.user,				
		});
};

//500 server error
exports.Error500 = (req,res)=>{
	    res.render('response/500',{
	        messages: {
	        	error: req.flash('error'),
	        	success: req.flash('success'),
	        	info: req.flash('info'),
	        }, 
	    	user: req.user,				
		});
};

//404 original page is not found
exports.Error404 = (req,res)=>{
		res.render('response/404',{
	        messages: {
	        	error: req.flash('error'),
	        	success: req.flash('success'),
	        	info: req.flash('info'),
	        }, 
	    	user: req.user,				
		});
};

//exports...
