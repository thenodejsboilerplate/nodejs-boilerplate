'use strict';
const nodemailer = require('nodemailer'),
  logger = require('./logger');

module.exports = config => {
  let smtpConfig = {
    host: config.mail_opts.host,
    port: config.mail_opts.port,
    secure: config.mail_opts.secure, // use SSL
    auth: {
      user: config.mail_opts.auth.user,
      pass: config.mail_opts.auth.pass
    }
  };

  let mailTransport = nodemailer.createTransport(smtpConfig);

  let from = ' "Server" <admin@trver.com>';
  let errorRecipient = 'frank25184@sina.com';

  function sendMail (to, subj, body) {
    return mailTransport.sendMail({
      from: from,
      to: to,
      subject: subj,
      html: body
// generateTextFromHtml: true
    }, function (err) {
      if (err) {
        logger.error('Unable to send mail: ' + err);
      } else {
        logger.debug(`successfully send mail to ${to}`);
      }
    });
  }

  function sendGroupMail (mailList, subj, body) {
    let mailLimit = 100;

    for (let i = 0; i < mailList.length / mailLimit; i++) {
      let toGroup = mailList.slice(i * mailLimit, (i + 1) * mailLimit).join(',');
      logger.debug(toGroup);

      return mailTransport.sendMail({
        from: from,
        to: toGroup,
        subject: subj,
        html: body
        // generateTextFromHtml: true
      }, function (err) {
        if (err) {
          logger.error('Unable to send mail: ' + err);
          return;
        }
      });
    }
  }

  return {
    send: sendMail,
    sendToGroup: sendGroupMail,
    mailError: (message, filename, exception) => {
      let body = '<h1>Site Error</h1>' + 'message: <br><pre>' + message + '</pre><br>';
      if (exception) { body += 'exception:<br><pre>' + exception + '</pre><br>'; }
      if (filename) { body += 'exception:<br><pre>' + filename + '</pre><br>'; }

      sendMail(errorRecipient, 'Site Error', body);
    }
  };
};
