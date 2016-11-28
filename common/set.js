"use strict";
const config = require('../config/config');
module.exports = function(app){
	app.set('port',process.env.PORT || config.port);
	app.set('env', 'production');
	//app.set('env','development');
    app.set('view engine',__dirname + '/views');
    return app;    
};