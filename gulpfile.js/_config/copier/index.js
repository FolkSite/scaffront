var _            = require('lodash'),
    __           = require('../../helpers'),
    gulp         = require('gulp'),
    gulpUtil     = require('gulp-util'),
    gulpRename   = require('gulp-rename'),
    gulpReplace  = require('gulp-replace'),
    gulpTap      = require('gulp-tap'),
    path         = require('path'),
    imagesConfig = require('../images')
  ;

var config = {};

var dests = {
  fancybox: path.join(imagesConfig.src.libs, 'fancybox')
};

var cleanupGlobs = [];
cleanupGlobs.push(__.getGlobPaths(dests.fancybox, '', true));


/**
 * @property {Copier} [build]
 * @property {Copier} [dist]
 */
config.build = [{
  from: __.getGlobPaths(__.getBowerPath('fancybox/source'), ['gif', 'png', 'jpg', 'svg']),
  to: dests.fancybox,
  transform: function (stream) {

    return stream;
  },
  cleanups: _.flatten(cleanupGlobs)
}, {

}];

config.dist = [];

module.exports.utils  = require('./utils');
module.exports.config = config;
