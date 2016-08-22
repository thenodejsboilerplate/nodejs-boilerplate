/**
usage: there is a folder static under views, in which you put any file(end with .hangdlebars) and it will generate the path and do not need you to write the routes
used for static files

inspired by we deveopment with node and express
**/
"use strict";
let autoViews = {};
const fs = require('fs');
const path = require('path');
const appDir = path.dirname(require.main.filename);



module.exports = function(app){
	app.use(function(req,res,next){
		const path = req.path.toLowerCase();
		console.log(path);
		if(autoViews[path]) {
			res.render('static/' + autoViews[path]);
		}else{
			fs.stat(appDir+'/views/static' + path + '.handlebars', function(err, stat) {
			    if(err == null) {
			        console.log('File exists');
			        autoViews[path] = path.replace(/^\//,'');
			        res.render('static/' + autoViews[path]);
			    } else if(err.code == 'ENOENT') {
			        // file does not exist
			        next('route');
			    } else {
			        console.log('Some other error: ', err.code);
			        return;
			    }
			});			
		}
		
	});
};
