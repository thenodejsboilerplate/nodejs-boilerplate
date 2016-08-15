//it's the underground for ./cache.js, which wrap the redis function
"use strict";
var config = require('../config/config');
var redis = require('redis');
var logger = require('./logger')
//cost context = require('../modules/context');

var client = redis.createClient({
	  port: config.db.redis.development.port,
	  host: config.db.redis.development.host,
	  db: config.db.redis.development.db,
	  pw: config.db.redis.development.password,
});

client.on('ready',function(err) {
	if(err){
	    logger.error('connect to redis error for ready , check your redis config',errr);		
	}

    logger.trace("Redis is ready");
// //logger.trace('Entering cheese testing');
// logger.debug('Got cheese.');
// logger.info('Cheese is Gouda.');
// logger.warn('Cheese is quite smelly.');
// logger.error('Cheese is too ripe!');
// logger.fatal('Cheese was breeding ground for listeria.');


});

client.on("connect", runSample);
//without expiration version:
// function runSample() {
//     // Set a value
//     client.set("string key", "Hello World", function (err, reply) {
//         console.log(reply.toString());
//     });
//     // Get a value
//     client.get("string key", function (err, reply) {
//         console.log(reply.toString());
//     });
// }
function runSample() {
    // Set a value with an expiration
    client.set('string key', 'Hello World', redis.print);
    // Expire in 3 seconds
    client.expire('string key', 3);
 
    // This timer is only to demo the TTL
    // Runs every second until the timeout
    // occurs on the value
    var myTimer = setInterval(function() {
        client.get('string key', function (err, reply) {
            if(reply) {
                console.log('I live: ' + reply.toString());
            } else {
                clearTimeout(myTimer);
                console.log('I expired');
                client.quit();
            }
        });
    }, 1000);
}

client.on('error', function (err) {
  if (err) {
    logger.error('connect to redis error, check your redis config', err);
    process.exit(1);
  }
});



exports = module.exports = client;
