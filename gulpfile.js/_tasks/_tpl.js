// https://github.com/osscafe/gulp-cheatsheet/blob/master/examples/js/stream-array.js

var _                = require('lodash'),
    __               = require('../helpers'),
    extend           = require('extend'),
    path             = require('path'),
    gulp             = require('gulp'),
    gulpUtil         = require('gulp-util'),
    gulpTap          = require('gulp-tap'),
    del              = require('del'),
    getObject        = require('getobject'),
    gulpChanged      = require('gulp-changed'),
    runSequence      = require('run-sequence').use(gulp),
    gulpPlumber      = require('gulp-plumber')
    //gulpUmd          = require('gulp-umd')
  ;

var server       = null,
    config       = require('../__config/_config'),
    _tplConfig  = config._tpl.config,
    copierUtils  = config.copier.utils,
    serverConfig = config.server.config,
    serverUtils  = config.server.utils;


gulp.task('_tpl:copier', function () {
  var result = copierUtils.copy(getObject.get(_tplConfig, 'copier'));

  if (typeof result != 'undefined') {
    server && serverUtils.reloadServer(serverConfig.devServerName);

    return result;
  }
});

gulp.task('_tpl:copier:cleanup', function () {
  return copierUtils.cleanup(getObject.get(_tplConfig, 'copier'));
});


gulp.task('_tpl:compile', function () {
  var stream = gulp.src(_tplConfig.src)
    .pipe(gulpPlumber(__.plumberErrorHandler))
  ;


  if (getObject.get(_tplConfig, 'transform') && _.isFunction(_tplConfig.transform)) {
    var transformStream = _tplConfig.transform(stream);

    if (gulpUtil.isStream(transformStream)) {
      stream = transformStream;
    }
  }

  stream = stream
    .pipe(gulp.dest(_tplConfig.dest))
  ;

  server && serverUtils.reloadServer(serverConfig.devServerName, stream);

  return stream;
});

gulp.task('_tpl:compile:cleanup', function (cb) {
  if (!getObject.get(_tplConfig, 'cleanups') || !_tplConfig.cleanups) {
    cb();
    return;
  }

  return del(_tplConfig.cleanups);
});


gulp.task('_tpl:build', function (cb) {
  runSequence(['_tpl:copier', '_tpl:compile'], cb);
});

gulp.task('_tpl:build:cleanup', function (cb) {
  runSequence(['_tpl:copier:cleanup', '_tpl:compile:cleanup'], cb);
});


gulp.task('_tpl:dist', function (cb) {
  runSequence('_tpl:build', cb);
});

gulp.task('_tpl:dist:cleanup', function (cb) {
  runSequence('_tpl:build:cleanup', cb);
});


gulp.task('_tpl:watch', function () {
  server = serverUtils.runServer(serverConfig.devServerName);

  gulp.watch(_tplConfig.src, ['_tpl:compile']);

  var copiers = getObject.get(_tplConfig, 'copier');
  if (copiers) {
    copiers = (!_.isArray(copiers)) ? [copiers] : copiers;
    copiers = _.map(copiers, function (copier) {
      return __.getCopier(copier).from;
    });
    copiers.length && gulp.watch(copiers, ['_tpl:copier']);
  }
});
