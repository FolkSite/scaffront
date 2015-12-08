var __              = require('../../helpers'),
    path            = require('path'),
    gulpUtil        = require('gulp-util'),
    gulpFont2Base64 = require('gulp-font2base64')
;

var config = {};

var src = 'app/fonts';

config.src = 'app/fonts/2css';
config.extnames = ['ttf', 'woff'];
config.dest = 'dist/css/fonts';

config.transform = function (stream) {
  if (!stream) { return; }
  if (!gulpUtil.isStream(stream)) { return stream; }

  stream.pipe(gulpFont2Base64());

  return stream;
};

//config.cleanups = __.getGlobPaths(config.src, ['css']);


var copySrc = path.join(src, 'asis');
/**
 * @type {Copier}
 * @property {Copier} [sass]
 * @property {Copier} [css]
 */
config.copier = {
  from: __.getGlobPaths(copySrc, ['eot', 'svg', 'ttf', 'woff', 'woff2'], true),
  to: config.dest,
  cleanups: __.getGlobPaths(config.dest, ['eot', 'svg', 'ttf', 'woff', 'woff2'])
};


module.exports.config = config;