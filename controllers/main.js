"use strict";
let fortuneLib = require('../lib/fortune.js');

exports.home = (req,res)=>{
			//console.log(mailService.sendToGroup(['frank25184@icloud.com','ddd@dd.com','djfd@sdf.com'],'subject','this is body'));
		    res.render('home/home', {
	            messages: {
	            	error: req.flash('error'),
	            	success: req.flash('success'),
	            	info: req.flash('info'),
	            },
		    	fortune: fortuneLib.getFortune() || 'There exist errors',
		    	user: req.user
		    });
};

exports.about = (req,res)=>{
		    res.render('home/about',{

		        pageTestScript: '/js/page-test/tests-about.js',//know which test file to be used in this route
	            messages: {
	            	error: req.flash('error'),
	            	success: req.flash('success'),
	            	info: req.flash('info'),
	            },		        
		        user: req.user
		    });
}

//exports...
