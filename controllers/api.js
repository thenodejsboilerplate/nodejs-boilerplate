"use strict";
// requires connect and connect-rest middleware
const connect = require('connect'),
      Rest    = require('connect-rest'),
      Attraction = require('../models/Attraction'); 

// sets up connect and adds other middlewares to parse query, parameters, content and session
// use the ones you need
var connectApp = connect()
    .use( bodyParser.urlencoded( { extended: true } ) )
    .use( bodyParser.json() );

// initial configuration of connect-rest. all-of-them are optional.
// default context is /api, all services are off by default
var options = {
    context: '/api',
    logger:{ file: '../logs/mochaTest.log', level: 'debug' },
    // apiKeys: [ '849b7648-14b8-4154-9ef2-8d1dc4c2bdjfkdjfkde9' ],
    // discoverPath: 'discover',
    // protoPath: 'proto'
};
var rest = Rest.create( options );

// adds connect-rest middleware to connect
connectApp.use( rest.processRequest() );


rest.get('/attractions', function(req,content,cb){
	Attraction.find({approved:true}, function(err,attractions){
		if(err){
			return cb({error: 'Internal error'});
		}
		cb(null, attractions.map(
			function(a){
				return {
					name:a.name,
					description:a.description,
					location:a.location,

				};
			}));
	});
});



rest.post('/attraction', function(req,content,cb){
	let a = new Attraction({
		name:req.body.name,
		description:req.body.description,
		location:{lat:req.body.lat,lng:req.body.lng}
		history:{
			event:'created',
			email:req.body.email,
			date:new Date(),
		},
		approved:false,
	});
	a.save(function (err,a) {
		if(err){
			return cb({err:'Unable to add attraction.'});
			cb(null, {id: a._id});
		}
	});
});


rest.get('/attraction/:id', function(req,content,cb){
	Attraction.findById(req.params.id, function(err,a){
		if(err){cb({err:'Unable to retrieve attraction.'})}
		cb(null,{
			name:attraction.name,
			description: attraction.description,
			location:attraction.location,
		});
	});

});



