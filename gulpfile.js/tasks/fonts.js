var _                 = require('lodash'),
    __                = require('../helpers'),
    extend            = require('extend'),
    path              = require('path'),
    gulp              = require('gulp'),
    gulpUtil          = require('gulp-util'),
    gulpTap           = require('gulp-tap'),
    gulpFont2Base64   = require('gulp-font2base64'),
    mergeStreams      = require('event-stream').merge,
    runSequence       = require('run-sequence'),
    del               = require('del'),
    gulpIf            = require('gulp-if'),
    getObject         = require('getobject')
;

var _config      = require('../_config'),
    Config       = _config.fonts,
    ServerConfig = _config.server;

var Server = null;

/**
 * @param [stream]
 */
var watcherHandler = function (stream) {
  if (!Server) { return; }

  if (gulpUtil.isStream(stream)) {
    stream.pipe(Server.stream({once: true}));
  } else {
    Server.reload({once: true});
  }
};

gulp.task('fonts:asis', function (cb) {
  var stream = __.getGulpSrc(__.getGlobPaths(Config.asis.src, Config.asis.extnames || []))
    .pipe(gulp.dest(Config.asis.dest));

  watcherHandler(stream);

  return stream;
});

gulp.task('fonts:asis:cleanup', function (cb) {
  if (Config.asis.extnames && __.getArray(Config.asis.extnames).length) {
    return del(__.getGlobPaths(Config.asis.dest, Config.asis.extnames));
  }

  cb();
});


gulp.task('fonts:tocss', function (cb) {
  var stream = __.getGulpSrc(__.getGlobPaths(Config.tocss.src, Config.tocss.extnames || []))
    .pipe(gulpFont2Base64())
    .pipe(gulp.dest(Config.asis.dest));

  watcherHandler(stream);

  return stream;
});

gulp.task('fonts:tocss:cleanup', function (cb) {
  var extnames = [];
  if (Config.tocss.extnames && __.getArray(Config.tocss.extnames).length) {
    _.each(Config.tocss.extnames, function (extname) {
      extnames.push(
        extname +'.css',
        extname +'.min.css'
      );
    });

    return del(__.getGlobPaths(Config.tocss.dest, extnames));
  }

  cb();
});

gulp.task('fonts:build', ['fonts:asis', 'fonts:tocss']);

gulp.task('fonts:build:cleanup', ['fonts:asis:cleanup', 'fonts:tocss:cleanup']);


gulp.task('fonts:dist', ['fonts:build']);

gulp.task('fonts:dist:cleanup', ['fonts:build:cleanup']);


gulp.task('fonts:watch', ['fonts:build'], function (cb) {
  if (_.isFunction(ServerConfig.getBrowserSync)) {
    Server = ServerConfig.getBrowserSync(ServerConfig.devServerName);
  }

  gulp.watch(__.getGlobPaths(Config.asis.src, Config.asis.extnames || []), ['fonts:asis']);
  gulp.watch(__.getGlobPaths(Config.tocss.src, Config.tocss.extnames || []), ['fonts:tocss']);
});

