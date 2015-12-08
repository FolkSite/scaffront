var _        = require('lodash'),
    __       = require('../helpers'),
    gulpUtil = require('gulp-util'),
    path     = require('path'),
    extend   = require('extend'),
    FS       = require('fs')
  ;


var config = {};

config.src = {
  inline: 'app/images/inline',
};

config.dest = {
  inline: 'dist/i',
};

config.transform = {
  build: {
    inline: function (stream) {
      stream = stream
        //.pipe()
      ;

      return stream;
    },
  },
  dist: {
    inline: function (stream) {
      stream = stream
        //.pipe()
      ;

      return stream;
    },
  },
};

config.cleanups = {
  build: {
    inline: __.getGlobPaths(config.dest, ['css', 'css.map', '!min.css', '!min.css.map'], true),
  },
  dist: {
    inline: '',
  }
};

/**
 * @type {Copier|Copier[]}
 */
config.copier = [{
  //from: __.getGlobPaths(__.getBowerPath('fancybox/source'), ['gif', 'png', 'jpg', 'svg']),
  //to: path.join(config.src.libs, 'fancybox'),
  //cleanups: __.getGlobPaths(path.join(config.src.libs, 'fancybox'), ['gif', 'png', 'jpg', 'svg'])
}];


module.exports.config = config;