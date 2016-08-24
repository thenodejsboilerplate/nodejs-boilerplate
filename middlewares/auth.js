"use strict";
module.exports = {
			// route middleware to make sure a user is logged in
		isLoggedIn: function (req, res, next) {

		    // if user is authenticated in the session, carry on 
		    if (req.isAuthenticated()){ 
		        return next();
		    }else{
				req.flash('error','You need to login first to access the page!');
				// if they aren't redirect them to the home page
				res.redirect('/user/login');
			}

		},

		notLoggedIn: function (req, res, next) {

		    // if user is authenticated in the session, carry on 
		    if (req.isAuthenticated()){
			    req.flash('error','You have already logined!');
			    // if they aren't redirect them to the home page
			    res.redirect('back');
		    }else{
               return next();
			}
		    

		},
		//roles is a string with , ,eg:"customer,seller"
		allow: function (roles){
			return function(req,res,next){
					if(req.user){
						let user      = req.user;
						let roleExist = roles.split(',').every(function(v){
							user.local.roles.indexOf(v) !== -1;
						});
						if(roleExist){
							return next();
						}
					}else{
						//next('route');
						req.flash('error','Sorry, you\'re not allowed to visit this page');
						res.redirect(303,'response/error');//unauthorized
					}				
			};

			
		},
}; 