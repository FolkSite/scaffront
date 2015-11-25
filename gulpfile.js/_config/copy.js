var _       = require('lodash'),
    Path    = require('path'),
    Extend  = require('extend'),
    Helpers = require('../helpers'),
    FS      = require('fs');

module.exports = (function () {
  var config = [{
    src: 'app/scripts/vendor',
    dest: 'dist/js/vendor'
  }];

  return config;
})();