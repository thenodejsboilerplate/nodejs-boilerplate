"use strict";
const express = require('express');
const router = express.Router();
// requires connect and connect-rest middleware
const connect = require('connect'),
      Rest    = require('connect-rest'),
      Attraction = require('../models/Attraction'),
      bodyParser = require('body-parser');; 

const api = require('../controllers/api');


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




router.get('/attractions',api.getAll);
router.get('/attraction',api.getOne);
router.get('/attraction/:id',api.putOne);

module.exports = router;
