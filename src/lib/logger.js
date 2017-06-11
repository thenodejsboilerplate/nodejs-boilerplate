'use strict';
const config = require('../common/get-config');
const env = process.env.NODE_ENV || 'develop';

const fs = require('fs'),
  logDir = 'logs';

// create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const winston = require('winston');
const tsFormat = () => (new Date()).toLocaleTimeString();

const logger = new (winston.Logger)({
  transports: [
    // colorize the output to the console
    new (winston.transports.Console)({
      timestamp: tsFormat,
      formatter: function (options) {
        // Return string will be passed to logger.
        return options.timestamp() + ' ' + options.level.toUpperCase() + ' ' + (undefined !== options.message ? options.message : '') +
          (options.meta && Object.keys(options.meta).length ? '\n\t' + JSON.stringify(options.meta) : '');
      },
      level: env === 'develop' ? 'debug' : 'error'
    }),

   // Log to a file in addition to the console
    // new (winston.transports.File)({
    //   filename: `${logDir}/results.log`,
    //   timestamp: tsFormat,
    //   level: env === 'development' ? 'debug' : 'info'
    // }),

    // Implement the code for the daily log file
    new (require('winston-daily-rotate-file'))({
      filename: `${logDir}/-results.log`,
      timestamp: tsFormat,
      formatter: function (options) {
        // Return string will be passed to logger.
        return options.timestamp() + ' ' + options.level.toUpperCase() + ' ' + (undefined !== options.message ? options.message : '') +
          (options.meta && Object.keys(options.meta).length ? '\n\t' + JSON.stringify(options.meta) : '');
      },
      datePattern: 'yyyy-MM-dd',
      prepend: true,
      level: env === 'develop' ? 'warn' : 'warn'
    })
  ]
});

module.exports = logger;
