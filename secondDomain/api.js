//api.frank:8050/login refers to localhost:8050/login? why?
//seems it need to overwrite the same route as localhost
"use strict";
const vhost = require('vhost'),
      //it's fine to load outside resources. we use CORS principle only when we use ajax to load resources
      cors  = require('cors'),
      corsOptions = {
           origin: 'http:///frank'//http://trver.com
      };

module.exports = (app,express)=>{

	var api = express.Router();

    app.use(vhost('api.frank', api));

    //do not use app.use(require('cors')()) in order to prevent attack,
    //cors is achieved by Access-Control-Allow-Origin header
    app.use('api.frank', require('cors')(corsOptions));

    api.get('/', (req,res)=>{
    	res.json({page: 'this is the home page of the api'});
    });	
    
    api.get('/about', (req,res)=>{
    	res.json({page: 'this is the about page of the api'});
    });	

    // api.get('/signup', (req,res)=>{
    // 	res.render('home/about');
    // });	

} 
