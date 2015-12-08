var _        = require('lodash'),
    __       = require('../helpers'),
    gulpUtil = require('gulp-util'),
    path     = require('path'),
    extend   = require('extend'),
    FS       = require('fs')
  ;


var config = {};

config.src = {
  inline:           'app/images/inline',
  inlineSprites:    'app/images/inline-sprites',
  inlineSpritesSvg: 'app/images/inline-sprites-svg',
  libs:             'app/images/libs',
  content:          'app/images/content'
};

config.dest = {
  inline:             'dist/i',
  inlineSprites:      'dist/i',
  inlineSpritesSvg:   'dist/i',
  libs:               'dist/i',
  content:            'dist/images'
};

config.transform = {
  build: {
    inline: function (stream) {
      stream = stream
        //.pipe()
      ;

      return stream;
    },
    inlineSprites: function (stream) {
      stream = stream
        //.pipe()
      ;

      return stream;
    },
    inlineSpritesSvg: function (stream) {
      stream = stream
        //.pipe()
      ;

      return stream;
    },
    libs: function (stream) {
      stream = stream
        //.pipe()
      ;

      return stream;
    },
    content: function (stream) {
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
    inlineSprites: function (stream) {
      stream = stream
        //.pipe()
      ;

      return stream;
    },
    inlineSpritesSvg: function (stream) {
      stream = stream
        //.pipe()
      ;

      return stream;
    },
    libs: function (stream) {
      stream = stream
        //.pipe()
      ;

      return stream;
    },
    content: function (stream) {
      stream = stream
        //.pipe()
      ;

      return stream;
    },
  },
};

config.cleanups = {
  build: {
    inline: __.getGlobPaths(config.dest.inline, ['css', 'css.map', '!min.css', '!min.css.map'], true),
    inlineSprites: '',
    inlineSpritesSvg: '',
    libs: '',
    content: '',
  },
  dist: {
    inline: '',
    inlineSprites: '',
    inlineSpritesSvg: '',
    libs: '',
    content: '',
  }
};

/**
 * @type {Copier}
 * @property {Copier} [sass]
 * @property {Copier} [css]
 */
config.copier = [{
  //from: __.getGlobPaths(__.getBowerPath('fancybox/source'), ['gif', 'png', 'jpg', 'svg']),
  //to: path.join(config.src.libs, 'fancybox'),
  //cleanups: __.getGlobPaths(path.join(config.src.libs, 'fancybox'), ['gif', 'png', 'jpg', 'svg'])
}];


module.exports.config = config;