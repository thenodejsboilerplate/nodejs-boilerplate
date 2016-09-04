"use strict";
const User  = require('../models/User');
//var uuid    = require('node-uuid');


var makeGravatar = function (email) {
  return 'http://www.gravatar.com/avatar/' + utility.md5(email.toLowerCase()) + '?size=48';
};

module.exports = {
      getUserById: (user_id,fn)=>{
              User.findById(user_id).exec((err,user)=>{
                      if(err){
                          console.log(`cannot catch user,error: ${err}`);
                          req.flash('error',`error in find user for ${user_id}`);
                          res.redirect('back');							
                      }else{
                          console.log(user);
                          let modifiedUser = user.processUser(user);
                          console.log(modifiedUser);
                          fn(modifiedUser);  
                    }
              });
      },



      newAndSave:  (username, password, email, logo, active, callback)=> {
        var user               = new User();
        user.local.username    = username;
        user.local.password    = user.password;
        user.local.email       = email;
      // user.local.active      = active || false;
        //user.accessToken = uuid.v4();
        user.save(callback);
      },



      /**
       * 根据用户名列表查找用户列表
       * Callback:
       * - err, 数据库异常
       * - users, 用户列表
       * @param {Array} names 用户名列表
       * @param {Function} callback 回调函数
       */
      getUsersByNames: function (names, callback) {
        if (names.length === 0) {
          return callback(null, []);
        }
        User.find({ loginname: { $in: names } }, callback);
      },

      /**
       * 根据登录名查找用户
       * Callback:
       * - err, 数据库异常
       * - user, 用户
       * @param {String} loginName 登录名
       * @param {Function} callback 回调函数
       * Use Tips::
       *    find each person with a last name matching 'Ghost', selecting the `name`  
       *      and `occupation` fields:
       *    Person.findOne({ 'name.last': 'Ghost' }, 'name occupation', function (err, 
       *      person)

            Query#find([criteria], [callback])--from doc

            or using query builder(find)
            Person.
              find({ occupation: /host/ }).
              where('name.last').equals('Ghost').
              where('age').gt(17).lt(66).
              where('likes').in(['vaporizing', 'talking']).
              limit(10).
              sort('-occupation').
              select('name occupation').
              exec(callback);
      */


      getUserByLoginName:  function (loginName, callback) {
        User.findOne({'loginname': new RegExp('^'+loginName+'$', "i")}, callback);
      },

      /**
       * 根据用户ID，查找用户
       * Callback:
       * - err, 数据库异常
       * - user, 用户
       * @param {String} id 用户ID
       * @param {Function} callback 回调函数
       */
      // exports.getUserById = function (id, callback) {
      //   if (!id) {
      //     return callback();
      //   }
      //   User.findOne({_id: id}, callback);
      // };

      /**
       * 根据邮箱，查找用户
       * Callback:
       * - err, 数据库异常
       * - user, 用户
       * @param {String} email 邮箱地址
       * @param {Function} callback 回调函数
       */
      getUserByMail: function (email, callback) {
        User.findOne({email: email}, callback);
      },

      /**
       * 根据用户ID列表，获取一组用户
       * Callback:
       * - err, 数据库异常
       * - users, 用户列表
       * @param {Array} ids 用户ID列表
       * @param {Function} callback 回调函数
       */
      getUsersByIds: function (ids, callback) {
        User.find({'_id': {'$in': ids}}, callback);
      },

      /**
       * 根据关键字，获取一组用户
       * Callback:
       * - err, 数据库异常
       * - users, 用户列表
       * @param {String} query 关键字
       * @param {Object} opt 选项
       * @param {Function} callback 回调函数  User.find(query, '', opt, callback);?????
       */
      getUsersByQuery: function (query, opt, callback) {
        User.find(query, '', opt, callback);
      },

      /**
       * 根据查询条件，获取一个用户
       * Callback:
       * - err, 数据库异常
       * - user, 用户
       * @param {String} name 用户名
       * @param {String} key 激活码
       * @param {Function} callback 回调函数
       */
      getUserByNameAndKey: function (loginname, key, callback) {
        User.findOne({loginname: loginname, retrieve_key: key}, callback);
      },

      makeGravatar: makeGravatar,

      getGravatar: function (user) {
        return user.avatar || makeGravatar(user);
      },









};
