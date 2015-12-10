var _                 = require('lodash'),
    __                = require('../helpers'),
    extend            = require('extend'),
    path              = require('path'),
    gulp              = require('gulp'),
    gulpUtil          = require('gulp-util'),
    gulpTap           = require('gulp-tap'),
    gulpPlumber       = require('gulp-plumber'),
    gulpFont2Base64   = require('gulp-font2base64'),
    runSequence       = require('run-sequence').use(gulp),
    del               = require('del'),
    getObject         = require('getobject')
;

var server       = null,
    config       = require('../_config'),
    fontsConfig  = config.fonts.config,
    serverConfig = config.server.config,
    serverUtils  = config.server.utils,
    copierUtils  = config.copier.utils;


gulp.task('fonts:copier', function () {
  var stream = copierUtils.copy(getObject.get(fontsConfig, 'copier'));

  if (stream && gulpUtil.isStream(stream)) {
    server && serverUtils.reloadServer(serverConfig.devServerName, stream);

    return stream;
  }
});

gulp.task('fonts:copier:cleanup', function () {
  return copierUtils.cleanup(getObject.get(fontsConfig, 'copier'));
});


gulp.task('fonts:2css', function () {
  var stream = gulp.src(__.getGlobPaths(fontsConfig.src, fontsConfig.extnames, true))
    .pipe(gulpPlumber(__.plumberErrorHandler))

      .pipe(gulpFont2Base64())

    .pipe(gulp.dest(fontsConfig.dest))
  ;

  server && serverUtils.reloadServer(serverConfig.devServerName, stream, {
    match: '**/*.css'
  });

  return stream;
});

gulp.task('fonts:2css:cleanup', function (cb) {
  if (!getObject.get(fontsConfig, 'cleanups') || !fontsConfig.cleanups) {
    cb();
    return;
  }

  return del(fontsConfig.cleanups);
});


gulp.task('fonts:build', function (cb) {
  runSequence(['fonts:copier', 'fonts:2css'], cb);
});

gulp.task('fonts:build:cleanup', function (cb) {
  runSequence(['fonts:copier:cleanup', 'fonts:2css:cleanup'], cb);
});


gulp.task('fonts:dist', function (cb) {
  runSequence('fonts:build', cb);
});

gulp.task('fonts:dist:cleanup', function (cb) {
  runSequence('fonts:build:cleanup', cb);
});


gulp.task('fonts:watch', function () {
  server = serverUtils.runServer(serverConfig.devServerName);

  gulp.watch(__.getGlobPaths(fontsConfig.src, fontsConfig.extnames, true), ['fonts:2css']);

  var copiers = getObject.get(fontsConfig, 'copier');
  if (copiers) {
    copiers = (!_.isArray(copiers)) ? [copiers] : copiers;
    copiers = _.map(copiers, function (copier) {
      return __.getCopier(copier).from;
    });
    copiers.length && gulp.watch(copiers, ['fonts:copier']);
  }
});

