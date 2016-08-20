"use strict";
const user = require('../models/User');
//utility function
function smartJoin(arr, separator){
	if(!separator){separator = ' '}
		return arr.filter(function(elt){
            return elt!==undefined &&
                   elt!==null &&
                   elt.toString().trim() !== '';

		});
}

module.exports = userId=>{
	const user = User.findById(userId);
	if(!user){
		return{
			error: 'Unknow user ID: ' + req.params.userId;
		}
	}
     
    return {
    	username: user.local.username,
    	email: user.local.email,
    	active: user.local.active,
    	logo: user.local.logo,
    	admin: user.local.admin,
    	created_at: user.local.created_at,
    	updated_at: user.local.updated_at,
    };






};