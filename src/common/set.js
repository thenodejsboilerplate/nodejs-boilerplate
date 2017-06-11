"use strict";
const config = require('../config/config');
const path = require('path');
module.exports = function(app){
	app.set('port',process.env.PORT || config.port);
	app.set('env', 'production');
	//app.set('env','development');
    // app.set('view engine',__dirname + '/src/views');
     // app.set('views', path.join(__dirname, 'src/views'))
    return app;    
};