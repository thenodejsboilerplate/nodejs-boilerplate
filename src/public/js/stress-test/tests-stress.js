"use strict";
const loadtest = require('loadtest');
const expect = require('chai').expect;

suite('Stress tests', ()=>{
	test('HomePage should handle 300 requests in a second',(done)=>{

		// function statusCallback(latency, result, error) {
		//     console.log('Current latency %j, result %j', latency, error ? JSON.stringify(error) + result.toString() : result);
		//     console.log('----');
		//     console.log('Request elapsed milliseconds: ', error ? error.requestElapsed : result.requestElapsed);
		//     console.log('Request index: ', error ? error.requestIndex : result.requestIndex);
		//     console.log('Request loadtest() instance index: ', error ? error.instanceIndex : result.instanceIndex);
		// }

	     let options = {
	        url:'http://localhost:8000',
	        concurrency: 4,
	        maxRequests: 300, 
	        //statusCallback: statusCallback
	     };

	     loadtest.loadTest(options, (err,result)=>{
	        expect(!err);
	        //expect(result.totalTimeSeconds < 1);
	        done();
	     });


	});
});