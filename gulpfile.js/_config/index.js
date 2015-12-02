//var _       = require('lodash'),
//    path    = require('path'),
//    extend  = require('extend'),
//    Helpers = require('../helpers'),
//    FS      = require('fs');

module.exports = (function () {
  var config = {};

  config.bower = {};
  config.styles = require('./styles');
  config.scripts = require('./scripts');
  //config.bower = require('./bower');
  config.templates = require('./templates');
  config.server = require('./server');
  config.copy = require('./copy');

  return config;
})();
