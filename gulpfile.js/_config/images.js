var _       = require('lodash'),
    __      = require('../helpers'),
    Path    = require('path'),
    Extend  = require('extend'),
    Helpers = require('../helpers'),
    FS      = require('fs');


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


/**
 * @type {Copier}
 * @property {Copier} [sass]
 * @property {Copier} [css]
 */
config.copier = [{
  from: __.getGlobPaths(__.getBowerPath('fancybox/source'), ['gif', 'png', 'jpg', 'svg']),
  to: path.join(config.src.libs, 'fancybox'),
  cleanups: __.getGlobPaths(path.join(config.src.libs, 'fancybox'), ['gif', 'png', 'jpg', 'svg'])
}];


module.exports = config;