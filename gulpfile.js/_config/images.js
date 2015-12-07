var _       = require('lodash'),
    Path    = require('path'),
    Extend  = require('extend'),
    Helpers = require('../helpers'),
    FS      = require('fs');


var config = {};

config.design = {
  src: 'app/images/design',
  dest: 'dist/i'
};

config.src = 'app/images',
config.dest = 'dist/js/vendor'


module.exports = config;