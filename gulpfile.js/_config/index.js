//var _       = require('lodash'),
//    Path    = require('path'),
//    Extend  = require('extend'),
//    Helpers = require('../helpers'),
//    FS      = require('fs');

module.exports = (function () {
  var config = {};

  config.bower = require('./bower');
  config.scripts = require('./scripts');
  config.templates = require('./templates');
  config.server = require('./server');
  config.copy = require('./copy');

  return config;
})();
