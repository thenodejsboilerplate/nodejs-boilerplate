'use strict';
const mongodb = require('src/common/get-config').mongodb;
const fixtures = require('pow-mongodb-fixtures').connect(mongodb.dbname, {
  host: mongodb.host,
  port: mongodb.port,
  user: mongodb.user,
  pass: mongodb.pass
});

function clearAll () {
  return new Promise((resolve, reject) => {
    fixtures.clear(function (err) {
      if (err) {
        reject();
      } else {
        resolve();
      }
    });
  });
}

function clearAllAndLoad (data) {
  return new Promise((resolve, reject) => {
    fixtures.clearAllAndLoad(data, function (err) {
      if (err) {
        reject();
      } else {
        resolve();
      }
    });
  });
}

module.exports = {
  clearAll,
  clearAllAndLoad
};
