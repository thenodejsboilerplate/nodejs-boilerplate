"use strict";
let nodemailer = require('nodemailer');

module.exports = credentials => {
	
	let smtpConfig = {
	    host: 'smtp.mxhichina.com',
	    port: 465,
	    secure: true, // use SSL
	    auth: {
	        user: credentials.mail.user,
	        pass: credentials.mail.pass
	    }
	};



	let mailTransport = nodemailer.createTransport(smtpConfig);

	let from = ' "Trver" <postmaster@trver.com>';
	let errorRecipient = "frank25184@sina.com";


	function sendMail(to,subj,body){
		 return mailTransport.sendMail({
		    	from: from,
		    	to: to,
		    	subject: subj,
		    	html:body,
		    	// generateTextFromHtml: true
               
			}, function(err){
				if(err){
					console.error('Unable to send mail: ' + err);
				}
			});
	}


	return {
		send: sendMail,
		mailError: function(message,filename,exception){
			let body = '<h1>Site Error</h1>' +
			           'message: <br><pre>' + message +'</pre><br>';
			if(exception) {body += 'exception:<br><pre>' + exception + '</pre><br>';}
			if(filename){body += 'exception:<br><pre>' + filename + '</pre><br>';}

			sendMail(errorRecipient,'Site Error', body);

		}
	};	

};