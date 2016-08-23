// app/routes.js
"use strict";
const user = require('./routes/user'),
      test = require('./routes/test'),
	  respond = require('./routes/respond'),
	  login3 = require('./routes/login3'),
	  index = require('./routes/index'),
	  api = require('./routes/api');

module.exports   = function(app, passport,User) {
	 app.use('/',index);  
	 app.use('/response',respond);   
	 app.use('/user',user(app,User,passport));
	 app.use('/api',api);
	 app.use('/auth',login3);

	 app.use('/test',test);

		//to get form data using req.body
		/*****form part end********/
};
