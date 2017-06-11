/**
 * Created by frank25184 on 7/15/16.
 */
//run :  mocha -u tdd -R spec public/js/logic-test/tests-unit-fortune.js
//this file does not need to be put in a html file
var fortune = require('../../../lib/fortune.js');
var expect = require('chai').expect;

suite('Fortune cookie tests', function(){
    test('getFortune() should return a fortune', function(){
        expect(typeof fortune.getFortune() === 'string');
    });
});