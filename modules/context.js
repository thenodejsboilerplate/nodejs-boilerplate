module.exports = function(app,mongoose){
	// set up our express application
    "use strict";
    //opts is optional but we wanna use keepAlive to prevent the app running from some bd connecting errors 
	const opts = {
		server: { keepAlive: 1 }
	};
	const dbConfig = require('../config/database');
	switch(app.get('env')){
		//run command:" NODE_ENV=production node app.js " if you wanna test the logging in the production envionment
		case 'development':
		  //concrete and colorful logging , log every request to the console
		  app.use(require('morgan')('dev'));
		  app.use(function(req,res,next){
		  	const cluster = require('cluster');
		  	if(cluster.isWorker){
		  		console.log(`Worker ${cluster.worker.id} received request`);//process.pid is the same
		  		next();//if forget this , the app will not work
		  	}else{
		  		console.log('no worker');
		  		next();
		  	}
		  });

          /**mongoose part**/
		  mongoose.connect(dbConfig.mongo.development.url);
		  break;
		case 'production':
		   //express-logger support logging loop(duplicate every 24 hours and begin new logs to prevent log files to become big forever)
		   app.use(require('express-logger')({
		   	   path: __dirname + '/log/requests.log'
		   }));

		   /**mongoose part**/
		   mongoose.connect(dbConfig.mongo.production.url);
		   break;

		default:
		    throw new Error('Unknown execution environment: ' + app.get(env));
	}









}
