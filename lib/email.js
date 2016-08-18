"use strict";
let nodemailer = require('nodemailer');

module.exports = config => {
	
	let smtpConfig = {
	    host: config.mail_opts.host,
	    port: config.mail_opts.port,
	    secure: config.mail_opts.secure, // use SSL
	    auth: {
	        user: config.mail_opts.user,
	        pass: config.mail_opts.pass
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

	function sendGroupMail(mailList,subj,body){
		    let mailLimit = 100;

            for(let i = 0; i<mailList.length/mailLimit; i++){

            	   let toGroup = mailList.slice(i*mailLimit, (i+1)*mailLimit).join(',');
            	   console.log(toGroup);

				    return mailTransport.sendMail({
				    	from: from,
				    	to: toGroup,
				    	subject: subj,
				    	html:body,
				    	// generateTextFromHtml: true
		               
					}, function(err){
						if(err){
							console.error('Unable to send mail: ' + err);
						}
					});            	
            }
	}


	return {
		send: sendMail,
		sendToGroup: sendGroupMail,
		mailError: function(message,filename,exception){
			let body = '<h1>Site Error</h1>' +
			           'message: <br><pre>' + message +'</pre><br>';
			if(exception) {body += 'exception:<br><pre>' + exception + '</pre><br>';}
			if(filename){body += 'exception:<br><pre>' + filename + '</pre><br>';}

			sendMail(errorRecipient,'Site Error', body);

		}
	};	

};