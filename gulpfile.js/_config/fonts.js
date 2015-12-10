var __              = require('../helpers'),
    path            = require('path'),
    gulpUtil        = require('gulp-util'),
    gulpFont2Base64 = require('gulp-font2base64')
;


var config = {};

var src = 'app/fonts/2css';

config.src = __.getGlobPaths(src, ['ttf', 'woff'] || [], true);
config.dest = 'dist/css/fonts';

config.transform = function (stream) {
  return stream
    .pipe(gulpFont2Base64())
  ;
};

config.cleanups = __.getGlobPaths(src, ['ttf.css', 'woff.css']);

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