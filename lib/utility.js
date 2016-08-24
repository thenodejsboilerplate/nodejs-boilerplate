"use strict";
const fs = require('fs');
module.exports = {
    checkDir: function(dir,callback){
            var callback = callback || function(){};
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







};