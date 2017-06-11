'use strict';
const xss = require('xss');
module.exports = function () {
  let options = {
    blackList: {

    },
        // stripIgnoreTagBody: true,
    allowCommentTag: false

  };  // Custom rules
  let myXss = new xss.FilterXSS(options);
    // then apply myxss.process()
    // html = myxss.process('<script>alert("xss");</script>');
  return myXss;
};
