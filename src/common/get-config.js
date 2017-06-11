'use strict';
const env = process.env.NODE_ENV || 'test';
const config = require(`../../config.${env}.js`);

if (!config) {
  throw new Error('CONFIG FILE `config.${env}.js` NOT EXISTING!');
}

module.exports = config;
