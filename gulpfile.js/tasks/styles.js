var _                = require('lodash'),
    __               = require('../helpers'),
    extend           = require('extend'),
    path             = require('path'),
    gulp             = require('gulp'),
    gulpFilter       = require('gulp-filter'),
    gulpUtil         = require('gulp-util'),
    gulpTap          = require('gulp-tap'),
    mergeStreams     = require('event-stream').merge,
    del              = require('del'),
    gulpIf           = require('gulp-if'),
    getObject        = require('getobject'),
    gulpChanged      = require('gulp-changed'),
    runSequence      = require('run-sequence').use(gulp),
    gulpPlumber      = require('gulp-plumber'),
    gulpRename       = require('gulp-rename'),
    gulpAutoprefixer = require('gulp-autoprefixer'),
    gulpSourcemaps   = require('gulp-sourcemaps'),
    gulpMinifyCss    = require('gulp-minify-css')
;

var Config       = require('../_config').styles,
    ServerConfig = require('../_config').server;

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
  return del(__.getGlobPaths(Config.dest, ['css', 'css.map']));
});


gulp.task('styles:css', function () {
  var stream = gulp.src(__.getGlobPaths(Config.src, ['css']))
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

  var stream = gulp.src(__.getGlobPaths(options.build.css.src, options.build.css.extnames, false))
    .pipe(gulpPlumber(__.plumberErrorHandler))
  ;

  if (getObject.get(Config, 'build.css.transform') && _.isFunction(Config.build.css.transform)) {
    var tmp = Config.build.css.transform(stream);
    stream = (gulpUtil.isStream(tmp)) ? tmp : stream;
  }

  stream = stream
    .pipe(gulp.dest(options.build.css.dest))
  ;

  watcherHandler(stream, options.build.css.browserSyncConfig);

  return stream;
});

gulp.task('styles:css:cleanup', ['styles:sass:cleanup']);


gulp.task('styles:build', ['styles:sass', 'styles:css']);

gulp.task('styles:build:cleanup', function () {
  return del(__.getGlobPaths(Config.dest, ['css', 'css.map']));
});


gulp.task('styles:dist', ['styles:build'], function (cb) {
  var stream = gulp.src(__.getGlobPaths(Config.dest, ['css'], false))
    .pipe(gulpPlumber(__.plumberErrorHandler));

  if (getObject.get(Config, 'dist.transform') && _.isFunction(Config.build.css.transform)) {
    var tmp = Config.build.css.transform(stream);
    stream = (gulpUtil.isStream(tmp)) ? tmp : stream;
  }

  stream = stream
    .pipe(gulp.dest(options.build.css.dest));

  return stream;
});

gulp.task('styles:dist:cleanup', ['styles:build:cleanup']);


gulp.task('styles:watch', ['styles:build'], function (cb) {
  if (_.isFunction(ServerConfig.getBrowserSync)) {
    Server = ServerConfig.getBrowserSync(ServerConfig.devServerName);
  }

  gulp.watch(__.getGlobPaths(Config.src, ['sass', 'scss']), ['styles:sass']);
  gulp.watch(__.getGlobPaths(Config.src, ['css']),          ['styles:css']);
});

