//When running a web server that interacts with a database, its operations may become a bottleneck. MongoDB is no exception here, and as your MongoDB database scales up, things can really slow down. Luckily, you can use a method called caching to speed things up.
//Caching is a strategy aimed at tackling the main storage problem, which means: the bigger the storage is, the slower will be, and vice versa. In a computer, you have the hard drive which is big but also relatively slow. You then have the RAM which is faster but smaller in its storage capabilities, and lastly the CPU registers which are very fast but tiny. 
//A cache is a component that stores recently accessed data in a faster storage system. Each time a request for that data is made, it can (with some probability) be pulled from the faster memory. The underlying assumption behind caching is that data which have been recently read, have a higher chance of being read again. Thus they should be stored in a faster memory so that even the next read will be quicker.
// MongoDB will be the main storage system, and we’ll build the cache using Redis. 
//main idea:

//to check if a key is in the cache,read it first from the redis cache if it's in the cache; if not in the cache of redis, then get from moogdb ,save to the redis cache and read

//use instance(get users on top activity): var cache = require('./cache');
// cache.get('tops', function(err,data){
//         if(err){...}
//         if(data){...}else{
//             User.getUsersByQuery(
//                 {is_block: false},
//                 { limit: 10, sort: '-score'},
//                 function(err,tops){
//                   cache.set('tops', tops, 60 * 1);
//                   return tops;
//                 }
//         }

// });


//It just saves each result to the Redis cache and keeps it there. In this way, the cache will slowly overload the computer’s RAM until it fills up.
//Due to this memory limitation, we must delete some of the items in the cache and only keep few of them. Ideally, we would want to keep those with the highest chances of getting read again only.
//We’ll use one of the most popular policies: the LRU (Least Recently Used). This policy deletes the cache items that were (as the name implies) the least recently used.
//To achieve that, we’ll add two arguments to the command starting Redis. The first will limit the amount of memory it can use (in this example we chose 512 MB), while the second will tell it to use the LRU policy. The command will look like that:

//redis-server --maxmemory 512mb --maxmemory-policy allkeys-lru
//Luckily for us, Redis has an LRU mechanism implemented within it
//Due to this memory limitation, we must delete some of the items in the cache and only keep few of them. Ideally, we would want to keep those with the highest chances of getting read again only

"use strict";
var redis  = require('./redis');
//var _      = require('lodash');
var logger = require('./logger');
var User = require('../models/User');

var get = (key, callback)=> {
  var t = new Date();
  redis.get(key, function (err, data) {
    if (err) {
      return callback(err);
    }
    if (!data) {
      return callback();
    }
    data = JSON.parse(data);
    var duration = (new Date() - t);
    logger.debug('Cache', 'get', key, (duration + 'ms').green);
    callback(null, data);
  });
};

exports.get = get;

// time 参数可选，秒为单位
var set = (key, value, time, callback='undefine') =>{

  var t = new Date();

  if (typeof time === 'function') {
    callback = time;
    time = null;
  }
 // callback = callback || 'undefine';//_.noop
  value = JSON.stringify(value);


  if (!time) {
    redis.set(key, value, callback);
  } else {
    redis.setex(key, time, value, callback);
  }
  var duration = (new Date() - t);
  logger.debug("Cache", "set", key, (duration + 'ms').green);
};

exports.set = set;



//One of the issues that caching introduces is that of keeping the cache up-to-date when data changes.
