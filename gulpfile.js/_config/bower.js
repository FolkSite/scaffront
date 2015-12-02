var _              = require('lodash'),
    __             = require('../helpers'),
    path           = require('path'),
    bowerDirectory = require('bower-directory');

var dir = bowerDirectory.sync();

var config = {
  dir: dir,
  dirRelative: path.relative(process.cwd(), dir)
};

module.exports = config;