var _       = require('lodash'),
    Path    = require('path'),
    Extend  = require('extend'),
    Helpers = require('../helpers'),
    FS      = require('fs');

module.exports = (function () {
  var config = {
    src: require('bower-directory').sync()
  };

  return config;
})();