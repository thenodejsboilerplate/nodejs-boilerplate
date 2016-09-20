"use strict";
const fs = require('fs');
module.exports = {

    /**
     * check if a directory exist! make it if it does not exist
     * @param {String} dir : the directory's name
     * @param {Function} callback: asyn function if checking dir finishes 
     * usage: require('./utility.js').checkDir(dataDir);
     */    
    checkDir: (dir,callback=function(){})=>{
            //var callback = callback || function(){};
            fs.stat(dir, function(err, stat) {
                if(err == null) {
                    console.log('Dir Exists');
                    //you still need to rename the file(what the function do) if dir exists,it's a must'
                    callback();
                    return;
                } else if(err.code == 'ENOENT') {
                    // file does not exist
                    console.log('no dir exists. Creating it...');
                    fs.mkdirSync(dir);
                    
                    callback();
                   
                    
                    //since the fs.stat is async so the action should be put here ensuring the dir is actually generated before the real action in the callback happens!
                    return;
                } else {
                    console.log('Some other error: ', err.code);
                    return;
                }
            });
    },

    /**
     * produce promise for fs.readFile
     * @param {String} filename 用户ID列表
     * usage: let promise = readFile("example.txt");...
     */
    readFile: filename => {
        return new Promise(function(resolve, reject) {

            // trigger the asynchronous operation
            
            //fs.readFile(file[, options], callback)
            //see https://nodejs.org/api/fs.html#fs_fs_readfile_file_options_callback
            fs.readFile(filename, { encoding: "utf8" }, function(err, contents) {
                //If no encoding is specified, then the raw buffer is returned.that's contents if a buffer if no encoding
                //If options is a string, then it specifies the encoding.

                // check for errors
                if (err) {
                    reject(err);
                    return;
                }

                // the read succeeded
                resolve(contents);

            });
        });
    },    
    /**
     *  use generator and promise for asynchronous task running;a function that can call a generator and start the iterator;It calls the generator to create an iterator and stores the iterator in task.
     * @param {Function}: a task definition (a generator function)
     * usage: 
     */
    run: taskDef => {

        // create the iterator, make available elsewhere
        let task = taskDef();

        // start the task
        let result = task.next();

        // recursive function to iterate through
        (function step() {

            // if there's more to do
            if (!result.done) {

                // resolve to a promise to make it easy
                let promise = Promise.resolve(result.value);
                promise.then(function(value) {
                    result = task.next(value);
                    step();
                }).catch(function(error) {
                    result = task.throw(error);
                    step();
                });
           }
         }());

   },

    /**
     * use es6 set to eliminate duplicates of the array 
     * @param {Function}: a task definition (a generator function)
     * usage: 
     * let numbers = [1, 2, 3, 3, 3, 4, 5], noDuplicates = eliminateDuplicates(numbers); console.log(noDuplicates); // [1,2,3,4,5]
     */
  eliminateDuplicates: items =>  [...new Set(items)],









};