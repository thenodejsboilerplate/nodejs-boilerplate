"use strict";
module.exports ={
		groupRate: (req,res)=>{
					//console.log(mailService.sendToGroup(['frank25184@icloud.com','ddd@dd.com','djfd@sdf.com'],'subject','this is body'));
					res.render('cross-browser-test/request-group-rate',{
						user: req.user ? req.user.processUser(req.user) : req.user,
					});
		},

		hoodRiver: (req,res)=>{
					res.render('cross-browser-test/hood-river',{
						user: req.user ? req.user.processUser(req.user) : req.user,
					});
		},
};


//exports...
