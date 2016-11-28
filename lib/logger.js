//https://github.com/nomiddlename/log4js-node
"use strict";
const config = require('../config/config');

let env = process.env.NODE_ENV || "development"

let log4js = require('log4js');
log4js.configure({
  appenders: [
    { type: 'console' },
    { type: 'file', filename: 'logs/cheese.log', category: 'cheese' }
  ]
});

let logger = log4js.getLogger('cheese');

logger.setLevel(config.debug && env !== 'test' ? 'DEBUG' : 'ERROR')

module.exports = logger;




/****
 * we can also use error log using express
 * 
 *   const fs = require('fs');
 *   const accessLogfile = fs.createWriteStream('access.log',{flags:'a'});
 *   const errorLogfile = fs.createWriteStream('error.log',{flags:'a'});
 * 
 * then at the first line of the app.configure function:
 *    app.use(express.logger({stream: accessLogfile}));
 * As  to error log,we nee to realize the error response along:
 * app.configure('production',function(){
 *   app.error(function(err,req,res,next){
 *      errorLogfile.write(meta+err.stack+'\n');
 *      next();
 *    });
 * });
 *  
 *  */




