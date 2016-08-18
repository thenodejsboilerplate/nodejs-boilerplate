"use strict";
const vhost = require('vhost');

module.exports = (app,express)=>{
	
	var api = express.Router();

    app.use(vhost('api.frank', api));

    api.get('/', (req,res)=>{
    	res.render('cross-browser-test/hood-river');
    });	
    
    api.get('/about', (req,res)=>{
    	res.render('home/about');
    });	

} 
