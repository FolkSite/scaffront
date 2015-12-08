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
    Config       = _config.fonts.config,
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


gulp.task('fonts:copier', function (cb) {
  var result = CopierUtils.copy(getObject.get(Config, 'copier'), cb);

  if (gulpUtil.isStream(result)) {
    return result;
  }
});

gulp.task('fonts:copier:cleanup', function (cb) {
  var result = CopierUtils.cleanup(getObject.get(Config, 'copier'), cb);

  if (gulpUtil.isStream(result)) {
    return result;
  }
});

gulp.task('fonts:builder', function () {
  var stream = gulp.src(__.getGlobPaths(Config.src, ['css', '!_*.css']))
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

gulp.task('fonts:builder:cleanup', function (cb) {
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


gulp.task('fonts:build', function (cb) {
  runSequence(['fonts:copier', 'fonts:builder'], cb);
});

gulp.task('fonts:build:cleanup', function (cb) {
  runSequence(['fonts:copier:cleanup', 'fonts:builder:cleanup'], cb);
});


gulp.task('fonts:dist', function (cb) {
  runSequence(['fonts:build'], cb);
});

gulp.task('fonts:dist:cleanup', function (cb) {
  runSequence(['fonts:dist:cleanup'], cb);
});



//gulp.task('styles:css', function (cb) {
//  runSequence('styles:css:copier', 'styles:css:builder', cb);
//});
//
//gulp.task('styles:css:cleanup', function (cb) {
//  runSequence(['styles:css:copier:cleanup', 'styles:css:builder:cleanup'], cb);
//});
//
//
//
//
//gulp.task('fonts:asis', function (cb) {
//  Config.asis.extnames = __.getArray(Config.asis.extnames || null);
//
//  var stream = __.getGulpSrc(__.getGlobPaths(Config.asis.src, Config.asis.extnames))
//    .pipe(gulpPlumber(__.plumberErrorHandler))
//    .pipe(gulp.dest(Config.asis.dest));
//
//  watcherHandler(stream);
//
//  return stream;
//});
//
//gulp.task('fonts:asis:cleanup', function (cb) {
//  if (Config.asis.extnames && __.getArray(Config.asis.extnames).length) {
//    return del(__.getGlobPaths(Config.asis.dest, Config.asis.extnames));
//  }
//
//  cb();
//});
//
//
//gulp.task('fonts:tocss', function (cb) {
//  var stream = __.getGulpSrc(__.getGlobPaths(Config.tocss.src, Config.tocss.extnames || []))
//    .pipe(gulpPlumber(__.plumberErrorHandler))
//    .pipe(gulpFont2Base64())
//    .pipe(gulp.dest(Config.asis.dest));
//
//  watcherHandler(stream, {
//    match: '**/*.css'
//  });
//
//  return stream;
//});
//
//gulp.task('fonts:tocss:cleanup', function (cb) {
//  var extnames = [];
//  if (Config.tocss.extnames && __.getArray(Config.tocss.extnames).length) {
//    _.each(Config.tocss.extnames, function (extname) {
//      extnames.push(
//        extname +'.css',
//        extname +'.min.css'
//      );
//    });
//
//    return del(__.getGlobPaths(Config.tocss.dest, extnames));
//  }
//
//  cb();
//});
//
//
//gulp.task('fonts:build', function (cb) {
//  runSequence(['fonts:asis', 'fonts:tocss'], cb);
//});
//
//gulp.task('fonts:build:cleanup', function (cb) {
//  runSequence(['fonts:asis:cleanup', 'fonts:tocss:cleanup'], cb);
//});
//
//
//gulp.task('fonts:dist', ['fonts:build']);
//
//gulp.task('fonts:dist:cleanup', ['fonts:build:cleanup']);


gulp.task('fonts:watch', function (cb) {
  if (_.isFunction(ServerConfig.getBrowserSync)) {
    Server = ServerConfig.getBrowserSync(ServerConfig.devServerName);
  }

  gulp.watch(__.getGlobPaths(Config.src, Config.extnames || []), ['fonts:builder']);

  var copiers = __.getCopier(getObject.get(Config, 'copier'));
  var copyWatchers = [];
  _.each(copiers, function (copier) {
    copyWatchers = copyWatchers.concat(copier.from);
  });
  copyWatchers.length && gulp.watch(copyWatchers, ['fonts:copier']);
});

