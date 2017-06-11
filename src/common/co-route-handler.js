'use strict';
const co = require('co');
const logger = require('../libs/logger');
const serverName = require('os').hostname();
const cluster = require('cluster');

const env = process.env.NODE_ENV || 'test';

module.exports = (handle) => {
  return (req, res, next) => {
    
    co(handle(req, res, next))
            .catch((err) => {
              logger.debug('into error handler');
              logger.error(`
                req: ${req},
                err: ${err},
                serverName: ${serverName},
                cluster: ${cluster.worker && cluster.worker.id}
                `
              );
              if(err.constructor.name === 'MessageError') {
                res.json({
                  Code: -20000,
                  Message: err.message
                });
              }
              else if(env ==='test' || env === 'develop'){
                res.json({
                  Code: -20000,
                  Message: err.stack
                });
              } else if(env === 'production') {
                res.json({
                  Code: -20000,
                  Message: '操作失败 '
                });
              }
            });
  };
};
