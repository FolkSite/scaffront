var _                = require('lodash'),
    __               = require('../helpers'),
    extend           = require('extend'),
    path             = require('path'),
    gulp             = require('gulp'),
    gulpUtil         = require('gulp-util'),
    gulpTap          = require('gulp-tap'),
    del              = require('del'),
    gulpIf           = require('gulp-if'),
    getObject        = require('getobject'),
    gulpChanged      = require('gulp-changed'),
    runSequence      = require('run-sequence').use(gulp),
    gulpPlumber      = require('gulp-plumber')
;

var _config      = require('../_config'),
    Config       = _config.styles.config,
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

gulp.task('styles:sass', function (cb) {
  var stream = gulp.src(__.getGlobPaths(Config.src, ['sass', 'scss']))
    .pipe(gulpPlumber(__.plumberErrorHandler))
  ;

  if (getObject.get(Config, 'transform.build.sass') && _.isFunction(Config.transform.build.sass)) {
    var tmp = Config.transform.build.sass(stream);
    stream = (gulpUtil.isStream(tmp)) ? tmp : stream;
  }

  stream = stream
    .pipe(gulp.dest(Config.dest))
  ;

  watcherHandler(stream, {
    match: '**/*.css'
  });

  return stream;
});

gulp.task('styles:sass:cleanup', function (cb) {
  cb();
});


gulp.task('styles:css', function () {
  var stream = gulp.src(__.getGlobPaths(Config.src, ['css', '!_*.css']))
    .pipe(gulpPlumber(__.plumberErrorHandler))
  ;

  if (getObject.get(Config, 'transform.build.css') && _.isFunction(Config.transform.build.css)) {
    var tmp = Config.transform.build.css(stream);
    stream = (gulpUtil.isStream(tmp)) ? tmp : stream;
  }

  stream = stream
    .pipe(gulp.dest(Config.dest))
  ;

  watcherHandler(stream, {
    match: '**/*.css'
  });

  return stream;
});

gulp.task('styles:css:cleanup', function (cb) {
  cb();
});


gulp.task('styles:copier', function (cb) {
  var result = CopierUtils.copy(getObject.get(Config, 'copier'), cb);

  if (gulpUtil.isStream(result)) {
    return result;
  }
});

gulp.task('styles:copier:cleanup', function (cb) {
  CopierUtils.cleanup(getObject.get(Config, 'copier'), cb);
});


gulp.task('styles:build', function (cb) {
  runSequence('styles:copier', ['styles:sass', 'styles:css'], cb);
});

gulp.task('styles:build:cleanup', function (cb) {
  runSequence(['styles:copier:cleanup', 'styles:sass:cleanup', 'styles:css:cleanup'], function () {
    if (!getObject.get(Config, 'cleanups.build') || !Config.cleanups.build) {
      cb();
      return;
    }

    del(Config.cleanups.build)
      .then(function () {
        cb();
      })
      .catch(cb);
  });
});


gulp.task('styles:dist', function (cb) {
  runSequence('styles:build', function () {
    var stream = gulp.src(__.getGlobPaths(Config.dest, ['css', '!min.css'], true))
      .pipe(gulpPlumber(__.plumberErrorHandler))
    ;

    if (getObject.get(Config, 'transform.dist') && _.isFunction(Config.transform.dist)) {
      var tmp = Config.transform.dist(stream);
      stream = (gulpUtil.isStream(tmp)) ? tmp : stream;
    }

    stream = stream
      .pipe(gulp.dest(Config.dest))
    ;

    stream.on('end', cb);
  });
});

gulp.task('styles:dist:cleanup', function (cb) {
  runSequence('styles:build:cleanup', function () {
    if (!getObject.get(Config, 'cleanups.dist') || !Config.cleanups.dist) {
      cb();
      return;
    }

    del(Config.cleanups.dist)
      .then(function () {
        cb();
      })
      .catch(cb);
  });
});


gulp.task('styles:watch', function (cb) {
  if (_.isFunction(ServerConfig.getBrowserSync)) {
    Server = ServerConfig.getBrowserSync(ServerConfig.devServerName);
  }

  gulp.watch(__.getGlobPaths(Config.src, ['sass', 'scss'], true), ['styles:sass:compile']);
  gulp.watch(__.getGlobPaths(Config.src, ['css'], true),          ['styles:css:compile']);

  var copiers, copyWatchers;

  copiers = __.getCopier(getObject.get(Config, 'copier'));
  copyWatchers = [];
  _.each(copiers, function (copier) {
    copyWatchers = copyWatchers.concat(copier.from);
  });
  copyWatchers.length && gulp.watch(copyWatchers, ['styles:copier']);
});

