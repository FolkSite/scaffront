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

var server       = null,
    config       = require('../_config'),
    fontsConfig  = config.fonts.config,
    serverConfig = config.server.config,
    serverUtils  = config.server.utils,
    copierUtils  = config.copier.utils;


gulp.task('fonts:copier', function (cb) {
  var stream = copierUtils.copy(getObject.get(fontsConfig, 'copier'), cb);

  if (stream && gulpUtil.isStream(stream)) {
    server && serverUtils.reloadServer(serverConfig.devServerName, stream);

    return stream;
  }
});

gulp.task('fonts:copier:cleanup', function (cb) {
  return copierUtils.cleanup(getObject.get(fontsConfig, 'copier'), cb);
});


gulp.task('fonts:builder', function (cb) {
  var stream = gulp.src(fontsConfig.src)
    .pipe(gulpPlumber(__.plumberErrorHandler))
  ;

  if (getObject.get(fontsConfig, 'transform') && _.isFunction(fontsConfig.transform)) {
    var tmp = fontsConfig.transform(stream, cb);
    stream = (gulpUtil.isStream(tmp)) ? tmp : stream;
  }

  stream = stream
    .pipe(gulp.dest(fontsConfig.dest))
  ;

  server && serverUtils.reloadServer(serverConfig.devServerName, stream);

  return stream;
});

gulp.task('fonts:builder:cleanup', function (cb) {
  if (!getObject.get(fontsConfig, 'cleanups') || !fontsConfig.cleanups) {
    cb();
    return;
  }

  del(fontsConfig.cleanups)
    .then(function () {
      cb();
    })
    .catch(cb);
});


gulp.task('fonts:build', function (cb) {
  runSequence(['fonts:copier', 'fonts:builder'], cb);
});

gulp.task('fonts:build:cleanup', function (cb) {
  runSequence(['fonts:copier:cleanup', 'fonts:builder:cleanup'], cb);
});


gulp.task('fonts:dist', function (cb) {
  runSequence('fonts:build', cb);
});

gulp.task('fonts:dist:cleanup', function (cb) {
  runSequence('fonts:dist:cleanup', cb);
});


gulp.task('fonts:watch', function () {
  server = serverUtils.runServer(serverConfig.devServerName);

  gulp.watch(fontsConfig.src, ['fonts:builder']);

  var copiers = __.getCopier(getObject.get(fontsConfig, 'copier'));
  var copyWatchers = [];
  _.each(copiers, function (copier) {
    copyWatchers = copyWatchers.concat(copier.from);
  });
  copyWatchers.length && gulp.watch(copyWatchers, ['fonts:copier']);
});

