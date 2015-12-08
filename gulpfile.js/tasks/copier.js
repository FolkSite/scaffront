var _                 = require('lodash'),
    __                = require('../helpers'),
    extend            = require('extend'),
    path              = require('path'),
    gulp              = require('gulp'),
    gulpUtil          = require('gulp-util'),
    gulpTap           = require('gulp-tap'),
    gulpFont2Base64   = require('gulp-font2base64'),
    mergeStreams      = require('event-stream').merge,
    gulpPlumber       = require('gulp-plumber'),
    runSequence       = require('run-sequence').use(gulp),
    del               = require('del'),
    gulpIf            = require('gulp-if'),
    getObject         = require('getobject')
  ;

var _config      = require('../_config'),
    Config       = _config.copier,
    ServerConfig = _config.server;


gulp.task('copier:build', function (cb) {
  var result = Config.copy(getObject.get(Config, 'build'), cb);

  if (gulpUtil.isStream(result)) {
    return result;
  }
});

gulp.task('copier:build:cleanup', function (cb) {
  var result = Config.cleanup(getObject.get(Config, 'build'), cb);

  if (gulpUtil.isStream(result)) {
    return result;
  }
});


gulp.task('copier:dist', function (cb) {
  runSequence('copier:build', cb);
});

gulp.task('copier:dist:cleanup', function (cb) {
  runSequence('copier:build:cleanup', cb);
});

