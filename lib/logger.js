//https://github.com/nomiddlename/log4js-node
const config = require('../config/config');

let env = process.env.NODE_ENV || "development"

const log4js = require('log4js');
log4js.configure({
  appenders: [
    { type: 'console' },
    { type: 'file', filename: 'logs/cheese.log', category: 'cheese' }
  ]
});

let logger = log4js.getLogger('cheese');

logger.setLevel(config.debug && env !== 'test' ? 'DEBUG' : 'ERROR')

module.exports = logger;



