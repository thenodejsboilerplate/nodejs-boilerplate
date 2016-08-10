"use strict";
function startServer(){
	const express = require('express');
	const bodyParser = require('body-parser');
	//to get the info of the form submit , you need to use req.body, which must require the body-parser middleware first
	const formidable = require('formidable');
	const fs = require('fs');
	const path = require('path');
	const mongoose = require('mongoose');
	const passport = require('passport');
	const flash    = require('connect-flash');

	//var morgan       = require('morgan');
	const cookieParser = require('cookie-parser');
	const session      = require('express-session');

	const exphbs  = require('express-handlebars');



	const dbConfig = require('./config/database');
	require('./config/passport')(passport); // pass passport for configuration
	const User = require('./models/User');


	mongoose.connect(dbConfig.url);

	const app = express();
	app.set('port',process.env.PORT || 8000);
	//app.set('env','development');

	//express-handlebar

	app.engine('handlebars', exphbs({defaultLayout: 'main'}));
	//This view engine adds back the concept of "layout", which was removed in Express 3.x. It can be configured with a path to the layouts directory, by default it's set to "views/layouts/".
	app.set('view engine', 'handlebars');

	app.use(express.static(__dirname + '/public'));
	//static中间件可以将一个或多个目录指派为包含静态资源的目录,其中资源不经过任何特殊处理直接发送到客户端,如可放img,css。 设置成功后可以直接指向、img/logo.png,static中间件会返回这个文件并正确设定内容类型


	app.use(function(req,res,next){
	    res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';
	    next();
	});
	//我们不希望测试一直进行，只在需要测试时显示，我们准备用用一些中间件在检测查询字符串中的test=1,它必须出现在我们所有路由前






	// set up our express application
	switch(app.get('env')){
		//run command:" NODE_ENV=production node app.js " if you wanna test the logging in the production envionment
		case 'development':
		  //concrete and colorful logging , log every request to the console
		  app.use(require('morgan')('dev'));
		  app.use(function(req,res,next){
		  	const cluster = require('cluster');
		  	if(cluster.isWorker){
		  		console.log(`Worker ${cluster.worker.id} received request`);//process.pid is the same
		  		next();//if forget this , the app will not work
		  	}else{
		  		console.log('no worker');
		  		next();
		  	}
		  });
		  break;
		case 'production':
		   //express-logger support logging loop(duplicate every 24 hours and begin new logs to prevent log files to become big forever)
		   app.use(require('express-logger')({
		   	   path: __dirname + '/log/requests.log'
		   }));
		   break;
	}




	app.use(cookieParser()); // read cookies (needed for auth)
	/******form part start：  get information from html forms*******/
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: false }));
	//or app.use(require('body-parser')());


	// required for passport
	app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
	app.use(passport.initialize());
	app.use(passport.session()); // persistent login sessions
	app.use(flash()); // use connect-flash for flash messages stored in session



	var routes = require('./routes')(app,passport,User);



	//customize 404 page using middleware
	app.use(function(req,res,next){
	    res.status(404);
	    res.render('errors/404');
	});

	//customize 505 page using middleware
	app.use(function(err,req,res,next){
	    console.error(err.stack);
	    // res.status(500);
	    // res.render('errors/500');
	    res.status(500).render('errors/500');
	});

	app.listen(app.get('port'), function(){
	    console.log('Express started on http://localhost:' + app.get('port') + ';press Ctrl-C to terminate');
	});	
}


if(require.main === module){
	//app runs directly, start server
	startServer();
}else{
	//app runs through a module imported by 'require': export the function
	module.exports = startServer;
}
