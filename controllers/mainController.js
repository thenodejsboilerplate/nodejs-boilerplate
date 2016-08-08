/**
 * Created by frank25184 on 7/17/16.
 */
"use strict";
let fortuneLib = require('../lib/fortune.js');
let main = {
    index: function(req,res){
        res.render('home/home', {fortune: fortuneLib.getFortune() || 'There exist errors'});
    },
    about: function(req,res){
        res.render('home/about',{
            pageTestScript: '/js/page-test/tests-about.js'//know which test file to be used in this route
        });
    },
    hood_river: function(req,res){
        res.render('cross-browser-test/hood-river');
    },
    request_group_rate: function(req,res){
        res.render('cross-browser-test/request-group-rate');
    }

};
module.exports = main;