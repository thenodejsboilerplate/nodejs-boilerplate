"use strict";
var express = require('express');
var bodyParser = require('body-parser');
//to get the info of the form submit , you need to use req.body, which must require the body-parser middleware first
var formidable = require('formidable');
var fs = require('fs');
var path = require('path');
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');

<<<<<<< HEAD
var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var session      = require('express-session');

var dbConfig = require('./config/database');
require('./config/passport')(passport); // pass passport for configuration
var User = require('./models/User');

mongoose.connect(dbConfig.url);

=======
>>>>>>> 564b1f26fec79635f706c636fa5eacd82a815a9c
var app = express();
app.set('port',process.env.PORT || 8000);
app.set('env','development');

//express-handlebar
var exphbs  = require('express-handlebars');
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

<<<<<<< HEAD






// set up our express application
app.use(morgan('dev')); // log every request to the console
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
=======
//routes
require('./routes/route.js')(app);
>>>>>>> 564b1f26fec79635f706c636fa5eacd82a815a9c

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