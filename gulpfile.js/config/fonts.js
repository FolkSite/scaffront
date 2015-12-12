var __              = require('../helpers'),
    path            = require('path'),
    gulpUtil        = require('gulp-util')
;

var config = {};

config.src = path.join(global.Builder.src, 'fonts/2css');
config.extnames = 'woff';
config.dest = path.join(global.Builder.dest, 'css/fonts');


config.cleanups = __.getGlobPaths(config.dest, 'woff.css', true);

/**
 * @type {Copier}
 * @property {Copier} [sass]
 * @property {Copier} [css]
 */
config.copier = {
  from: __.getGlobPaths('app/fonts/asis', ['eot', 'svg', 'ttf', 'woff', 'woff2'], true),
  to: config.dest,
  cleanups: __.getGlobPaths(config.dest, ['eot', 'svg', 'ttf', 'woff', 'woff2'], true)
};


module.exports.config = config;