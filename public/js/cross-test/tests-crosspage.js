//run :  mocha -u tdd -R spec public/js/cross-test/tests-crosspage.js 2>/dev/null
//this file does not need to be put in a html file
    "use strict";
    var Browser = require('zombie'),
        assert = require('chai').assert;
    var browser;
    suite('Cross Page Tests', function(){
        setup(function(){
            browser = new Browser();
        });//the param of setup is a function. the testing frame will execute it before running each test.Here we build a new browser instance for each test.so we have 3 tests

        // test('requesting a group rate from the hood river page should populate the referrer field', function(done){
        //     var referrer = 'http://localhost:8000/cross-browser/hood-river';
        //     browser.visit(referrer, function(){
        //         browser.clickLink('.requestGroupRate',function(){
        //             assert(browser.field('referrer').value === referrer);
        //             done();
        //         });
        //     });
        // });

        // test('requesting a group rate from other page should populate the referrer field', function(done){
        //     var referrer = 'htttp://localhost:8000/cross-browser/otherddd';
        //     browser.visit(referrer, function(){
        //         browser.clickLink('.requestGroupRate'/*classname*/,function(){
        //             assert(browser.field('referrer').value === referrer);
        //             done();
        //         });
        //     });
        // });

        test('visiting the "request group rate page" directly shoould resultn an empty  referrer field', function(done){
            var referrer = 'http://localhost:8000/cross-browser/request-group-rate';
            browser.visit(referrer, function(){

                assert(browser.field('referrer').value === '');
                done();
            });
        });

    });
<<<<<<< HEAD
=======

>>>>>>> 564b1f26fec79635f706c636fa5eacd82a815a9c
