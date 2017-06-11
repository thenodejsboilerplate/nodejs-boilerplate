'use strict';
// Helmet helps you secure your Express apps by setting various HTTP headers.
const helmet = require('helmet');
module.exports = function (app) {
    // the same as app.set('x-powered-by', false) from: http://expressjs.com/en/api.html#app.disable
    // app.disable('x-powered-by');which helmet includes it
  app.use(helmet());
};
