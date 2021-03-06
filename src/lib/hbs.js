'use strict';
const exphbs = require('express-handlebars');
const blocks = {};
const config = require('../common/get-config');
var logger = require('./logger');

const baseUrl = config.host;
const maps = function (name) {
  return baseUrl + '/src/public' + name;// in order to be fast ,  '/' should be added before name
};

module.exports = function (app) {
	// Create `ExpressHandlebars` instance with a default layout.
  var hbs = exphbs.create({
    defaultLayout: 'main',
    helpers: {
      extend: (name, context) => {
        var block = blocks[name];
        if (!block) {
          block = blocks[name] = [];
        }
        block.push(context.fn(this)); // for older versions of handlebars, use block.push(context(this));
      },
      block: (name) => {
        var val = (blocks[name] || []).join('\n');

        // clear the block
        blocks[name] = [];
        return val;
      },
      static: (name) => {
        return maps(name);
      },
      math: (lvalue, operator, rvalue) => {
        lvalue = parseFloat(lvalue);
        rvalue = parseFloat(rvalue);
        let value;
        switch (operator) {
          case '+':
            value = lvalue + rvalue;
            break;
          case '-':
            value = lvalue - rvalue;
            break;
          case '*':
            value = lvalue * rvalue;
            break;
          case '/':
            value = lvalue / rvalue;
            break;
          case '%':
            value = lvalue % rvalue;
            break;
          default:
            logger.info('Do not support the operator!');

        }
        return value;
      }

    },

    // Uses multiple partials dirs, templates in "shared/templates/" are shared
    // with the client-side of the app (see below).
    partialsDir: [
      //'shared/templates/',
      'src/views/partials/'
    ],
    layoutsDir: 'src/views/layouts'
    
  });

	// Register `hbs` as our view engine using its bound `engine()` function.
  app.engine('handlebars', hbs.engine);
	// This view engine adds back the concept of "layout", which was removed in Express 3.x. It can be configured with a path to the layouts directory, by default it's set to "views/layouts/".
  app.set('view engine', 'handlebars');
};
