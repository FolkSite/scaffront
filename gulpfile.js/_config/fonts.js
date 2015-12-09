var __              = require('../helpers'),
    path            = require('path'),
    gulpUtil        = require('gulp-util'),
    gulpFont2Base64 = require('gulp-font2base64')
;

var config = {};

config.src = __.getGlobPaths('app/fonts/2css', ['ttf', 'woff'] || [], true);
config.dest = 'dist/css/fonts';

config.transform = function (stream, cb) {
  if (!stream) { return; }
  if (!gulpUtil.isStream(stream)) { return stream; }

  stream.pipe(gulpFont2Base64());

  return stream;
};

//config.cleanups = __.getGlobPaths(config.src, ['css']);

/**
 * @type {Copier}
 * @property {Copier} [sass]
 * @property {Copier} [css]
 */
config.copier = {
  from: __.getGlobPaths('app/fonts/asis', ['eot', 'svg', 'ttf', 'woff', 'woff2'], true),
  to: config.dest,
  cleanups: __.getGlobPaths(config.dest, ['eot', 'svg', 'ttf', 'woff', 'woff2'])
};


module.exports.config = config;