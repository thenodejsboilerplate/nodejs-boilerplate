
function startServer(){
	"use strict";

    const config = require('./config/config');

	const express = require('express');
	const bodyParser = require('body-parser');
	//to get the info of the form submit , you need to use req.body, which must require the body-parser middleware first
	const formidable = require('formidable');
	const fs = require('fs');
	const path = require('path');
	const mongoose = require('mongoose');
	const passport = require('passport');

	//Flash messages are stored in the session. First, setup sessions as usual by enabling cookieParser and session middleware. Then, use flash middleware provided by connect-flash.With the flash middleware in place, all requests will have a req.flash() function that can be used for flash messages.
	const flash    = require('connect-flash');

	const cookieParser = require('cookie-parser');
	const session      = require('express-session');




	require('./lib/passport')(passport); // pass passport for configuration
	const User = require('./models/User');    

	const app = express();

	//for logs, db ... in the different context (development or production)
	const context = require('./common/context').env1(app,mongoose);

    //set app attribute
    require('./common/set')(app);

	app.use(express.static(__dirname + '/public'));
	app.use(express.static(__dirname + '/node_modules'));
	//static中间件可以将一个或多个目录指派为包含静态资源的目录,其中资源不经过任何特殊处理直接发送到客户端,如可放img,css。 设置成功后可以直接指向、img/logo.png,static中间件会返回这个文件并正确设定内容类型
    

   //for setting second domain using vhost
   require('./api/api')(app,express);
   require('./lib/hbs')(app);

	app.use(function(req,res,next){
	    res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';
	    next();
	});
	//我们不希望测试一直进行，只在需要测试时显示，我们准备用用一些中间件在检测查询字符串中的test=1,它必须出现在我们所有路由前

	app.use(cookieParser()); // read cookies (needed for auth)
	/******form part start：  get information from html forms*******/
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: false }));
	//or app.use(require('body-parser')());

	//redis session starts:
	// Create express-session and pass it to connect-redis object as parameter. This will initialize it.
	const redisStore = require('connect-redis')(session);
	//Then in session middle ware, pass the Redis store information such as host, port and other required parameters.
	const client = require('./lib/redis');
	app.use(session({
	    secret: config.session_secret,
		cookie: {maxAge: 1000 * 60 * 60 * 24 * 30},//30 days
	    // create new redis store.
	    store: new redisStore({port:config.db.redis.development.port, host:config.db.redis.development.host,ps:config.db.redis.development.pw, ttl :  config.db.redis.development.ttl}),//Redis session TTL (expiration) in seconds
	    //saveUninitialized: false,
	    //resave: false
    }));

    //If Redis server running, then this is default configuration. Once you have configured it. you can use like:
        //    req.session.key_name = value to set 
        // this will be set to redis, value may contain User ID, email or any information which you need across your application.
        //Fetch the information from redis session key.
        //     req.session.key["keyname"]


	// required for passport
	//app.use(session({ secret: 'ssshhhhh' })); // session secret

	app.use(passport.initialize());
	app.use(passport.session()); // persistent login sessions
	app.use(flash()); // use connect-flash for flash messages stored in session
 

    // app.use(function(req,res,next){
    // 	//pass it to the context if there is flash message and then delete it
    // 	res.locals.flash = req.session.flash;
    // 	delete req.session.flash;
    // 	next();
    // }); 

    //ensure you tell express that you've used a proxy and it should be trusted if yuo set a proxy server like ngnix so req.ip, req.protocol,req.secure can reflect the connectiong details of the client and the proxy server rather than between your client and your app. Besides, req.ips will be an array, wihch is composed of IP of original client and IP or names of all the middle proxy
    app.enable('trust proxy');
 
    //prevent CSRF attack by ensuring requests legally from your site
    // app.use(require('csurf')());
    // app.use(function(req,res,next){
    // 	res.locals.csrfToken = req.csrfToken();
    // 	next();
    // });
	const routes = require('./routes')(app,passport,User);
    const autoView = require('./common/autoView')(app);

	//customize 404 page using middleware
	app.use(function(req,res,next){
	    res.status(404);
	    res.render('response/404');
	});

	//customize 505 page using middleware
	app.use(function(err,req,res,next){
	    console.error(err.stack);
	    // res.status(500);
	    // res.render('errors/500');
	    res.status(500).render('response/500');
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
