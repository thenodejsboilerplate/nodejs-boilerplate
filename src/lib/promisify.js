'use strict';
const fs = require('fs');
var logger = require('./logger');
const childProcess = require('child_process');
module.exports = {
     /**
     * produce promise for fs.readFile
     * @param {String} filename 用户ID列表
     * @param {function} callback optional,defalut: function(){}
     *  With the generators functions already being available and with the upcoming async functions your modules (the ones published to NPM) should expose an error-first callback interface with Promise support.
      Why? To provide backward compatibility a callback interface has to be provided, and for future compatibility you will need the Promise support as well.
     * usage: let promise = readFile("example.txt");...
     */
  readFile: (filename, callback = function () {}) => {
    return new Promise(function (resolve, reject) {
            // fs.readFile(file[, options], callback)
            // see https://nodejs.org/api/fs.html#fs_fs_readfile_file_options_callback
      fs.readFile(filename, { encoding: 'utf8' }, function (err, contents) {
          // If no encoding is specified, then the raw buffer is returned.that's contents if a buffer if no encoding
          // If options is a string, then it specifies the encoding.
        if (err) {
          reject(err);
          return callback(err);
        }

        resolve(contents);
        return callback(null, contents);
      });
    });
  },

  childProcessExec: function(cmd, callback  = function () {}){
    //logger.debug('into childProcessExec in promisify module');
    return new Promise(function(resolve, reject){
      childProcess.exec(cmd, function(err, stdout,stderr){
        if(err){
          reject(err);
          return callback(err);
        }
        resolve(stdout);

        return callback(null, stdout, stderr);

      });
    });


  },



};
