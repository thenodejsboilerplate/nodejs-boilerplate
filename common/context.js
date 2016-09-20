"use strict";
const config = require('../config/config');
module.exports = {

	env1: (app,mongoose)=>{
			// set up our express application
		    "use strict";
		    //opts is optional but we wanna use keepAlive to prevent the app running from some bd connecting errors 
			const opts = {
				server: { keepAlive: 1 }
			};
			
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
				  mongoose.connect(config.db.mongo.development.url);
				  //delete the caches of all the loaded modules,which is an object with key and values
				  delete require.cache;

				  break;
				case 'production':
				   //express-logger support logging loop(duplicate every 24 hours and begin new logs to prevent log files to become big forever)
				   app.use(require('express-logger')({
				   	   path: __dirname + '/log/requests.log'
				   }));

				   /**mongoose part**/
				   mongoose.connect(config.db.mongo.production.url);
				   break;

				default:
				    throw new Error('Unknown execution environment: ' + app.get(env));
			}
		},

        
		// redis:  function(app){
  //             switch(app.get('env')){
	 //              	 case 'development':
	 //                  return {
		// 				  port: config.db.redis.development.port,
		// 				  host: config.db.redis.development.host,
		// 				  db: config.db.redis.development.db,
		// 				  password: config.db.redis.development.password,			
		// 	          };
	 //              	 break;

	 //              	 case 'production':
	 //                  return {
		// 				  port: config.db.redis.development.port,
		// 				  host: config.db.redis.development.host,
		// 				  db: config.db.redis.development.db,
		// 				  password: config.db.redis.development.password,			
		// 	          };
		// 	          break;

		// 	         default:

		// 	          throw new Error('Unknown execution environment: ' + app.get(env));           	 
  //             }
		// }








}
