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
    config       = require('../config'),
    pagesConfig  = config.pages.config,
    pagesUtils   = config.pages.utils,
    copierUtils  = config.copier.utils,
    serverConfig = config.server.config,
    serverUtils  = config.server.utils;


var _config      = require('../_config'),
    Config       = _config.images.config,
    ServerConfig = _config.server,
    CopierUtils  = _config.copier.utils;


var Server = null;


gulp.task('images:copier', function (cb) {
  CopierUtils.copy(getObject.get(Config, 'copier'), cb);
});

gulp.task('images:copier:cleanup', function (cb) {
  CopierUtils.cleanup(getObject.get(Config, 'copier'), cb);
});


gulp.task('images:builder', function () {
  var stream = gulp.src(__.getGlobPaths(Config.src, Config.extnames || [], true))
      .pipe(gulpPlumber(__.plumberErrorHandler))
    ;

  if (getObject.get(Config, 'transform') && _.isFunction(Config.transform)) {
    var tmp = Config.transform(stream);
    stream = (gulpUtil.isStream(tmp)) ? tmp : stream;
  }

  stream = stream
    .pipe(gulp.dest(Config.dest))
  ;

  //watcherHandler(stream);

  return stream;
});

gulp.task('images:builder:cleanup', function (cb) {
  if (!getObject.get(Config, 'cleanups') || !Config.cleanups) {
    cb();
    return;
  }

  del(Config.cleanups)
    .then(function () {
      cb();
    })
    .catch(cb);
});


gulp.task('images:build', function (cb) {
  runSequence(['images:copier', 'images:builder'], cb);
});

gulp.task('images:build:cleanup', function (cb) {
  runSequence(['images:copier:cleanup', 'images:builder:cleanup'], cb);
});


gulp.task('images:dist', function (cb) {
  runSequence('images:build', cb);
});

gulp.task('images:dist:cleanup', function (cb) {
  runSequence('images:dist:cleanup', cb);
});


gulp.task('images:watch', function () {
  server = serverUtils.runServer(serverConfig.devServerName);

  gulp.watch(__.getGlobPaths(Config.src, Config.extnames || []), ['images:builder']);

  var copiers = __.getCopier(getObject.get(Config, 'copier'));
  if (copiers) {
    copiers = (!_.isArray(copiers)) ? [copiers] : copiers;
    copiers = _.map(copiers, function (copier) {
      return __.getCopier(copier).from;
    });
    copiers = _.compact(copiers);
    copiers.length && gulp.watch(copiers, ['images:copier']);
  }
});

