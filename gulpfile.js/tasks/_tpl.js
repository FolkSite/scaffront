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
    Config       = _config._tpl.config,
    ServerConfig = _config.server,
    CopierUtils  = _config.copier.utils;


var Server = null;

/**
 * @param [stream]
 * @param {{}} [bsConfig]
 */
var watcherHandler = function (stream, bsConfig) {
  if (!Server) { return; }

  bsConfig = (_.isPlainObject(bsConfig)) ? bsConfig : {};

  if (gulpUtil.isStream(stream)) {
    stream.pipe(Server.stream(bsConfig));
  } else {
    Server.reload(bsConfig);
  }
};


gulp.task('_tpl:copier', function (cb) {
  CopierUtils.copy(getObject.get(Config, 'copier'), cb);
});

gulp.task('_tpl:copier:cleanup', function (cb) {
  CopierUtils.cleanup(getObject.get(Config, 'copier'), cb);
});


gulp.task('_tpl:builder', function () {
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

  watcherHandler(stream);

  return stream;
});

gulp.task('_tpl:builder:cleanup', function (cb) {
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


gulp.task('_tpl:build', function (cb) {
  runSequence(['_tpl:copier', '_tpl:builder'], cb);
});

gulp.task('_tpl:build:cleanup', function (cb) {
  runSequence(['_tpl:copier:cleanup', '_tpl:builder:cleanup'], cb);
});


gulp.task('_tpl:dist', function (cb) {
  runSequence('_tpl:build', cb);
});

gulp.task('_tpl:dist:cleanup', function (cb) {
  runSequence('_tpl:dist:cleanup', cb);
});


gulp.task('_tpl:watch', function (cb) {
  if (_.isFunction(ServerConfig.getBrowserSync)) {
    Server = ServerConfig.getBrowserSync(ServerConfig.devServerName);
  }

  gulp.watch(__.getGlobPaths(Config.src, Config.extnames || []), ['_tpl:builder']);

  var copiers = __.getCopier(getObject.get(Config, 'copier'));
  var copyWatchers = [];
  _.each(copiers, function (copier) {
    copyWatchers = copyWatchers.concat(copier.from);
  });
  copyWatchers.length && gulp.watch(copyWatchers, ['_tpl:copier']);
});

