"use strict";
let assert = require('chai').assert;
const http = require('http');
const rest = require('restler');

suite('API tests', function(){
	const attraction = {
		lat: 45.5433,
		lng: -122.443,
		name: 'Portland Art Museum',
		description: 'Founded in 1892, the Portland Art Museum\'s collection of native art is not to be missed.',
		email: 'frank25184@sina.com',
	};

    const base = 'http://localhost:8000';

    test('shold be able to add an attraction', function(done){
    	rest.post(base+'/api/attraction', {data:attraction}).on('success',function(data){
    		assert.match('data.id', /\w/, 'id must be set');
    		done();
    	});
    });

    test('should be able to retrieve an attraction', function(done){
    	rest.post(base + '/api/attraction/' + data.id).on('success',function(data){
    		rest.get(base+'/api/attraction/'+data.id).on('success',function(data){
    			assert(data.name===attraction.name);
    			assert(data.description===attraction.description);
    			done();
    		});
    	});
    });


});