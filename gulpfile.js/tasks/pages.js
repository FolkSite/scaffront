// https://github.com/osscafe/gulp-cheatsheet/blob/master/examples/js/stream-array.js
// https://www.npmjs.com/login?done=/package/gulp-consolidate

var _                = require('lodash'),
    __               = require('../helpers'),
    extend           = require('extend'),
    path             = require('path'),
    gulp             = require('gulp'),
    gulpUtil         = require('gulp-util'),
    gulpTap          = require('gulp-tap'),
    del              = require('del'),
    getObject        = require('getobject'),
    lazypipe         = require('lazypipe'),
    gulpChanged      = require('gulp-changed'),
    runSequence      = require('run-sequence').use(gulp),
    gulpPlumber      = require('gulp-plumber')
    //gulpUmd          = require('gulp-umd')
  ;

var server       = null,
    config       = require('../_config'),
    pagesConfig  = config.pages.config,
    copierUtils  = config.copier.utils,
    serverConfig = config.server.config,
    serverUtils  = config.server.utils;


gulp.task('pages:copier', function () {
  var result = copierUtils.copy(getObject.get(pagesConfig, 'copier'));

  if (typeof result != 'undefined') {
    server && serverUtils.reloadServer(serverConfig.devServerName);

    return result;
  }
});

gulp.task('pages:copier:cleanup', function () {
  return copierUtils.cleanup(getObject.get(pagesConfig, 'copier'));
});


gulp.task('pages:compile', function (cb) {
  var stream = gulp.src(pagesConfig.src)
    .pipe(gulpPlumber(__.plumberErrorHandler))
  ;


  if (getObject.get(pagesConfig, 'transform') && _.isFunction(pagesConfig.transform)) {
    //var tmp = pagesConfig.transform(stream, cb).pipe(gulp.dest(pagesConfig.dest));
    var transformStream = pagesConfig.transform(stream);

    if (gulpUtil.isStream(transformStream)) {
      stream = transformStream;
    }
  }

  stream = stream
    .pipe(gulp.dest(pagesConfig.dest))
  ;

  server && serverUtils.reloadServer(serverConfig.devServerName, stream);

  return stream;
});

gulp.task('pages:compile:cleanup', function (cb) {
  if (!getObject.get(pagesConfig, 'cleanups') || !pagesConfig.cleanups) {
    cb();
    return;
  }

  del(pagesConfig.cleanups)
    .then(function () {
      cb();
    })
    .catch(cb);
});


gulp.task('pages:build', function (cb) {
  runSequence(['pages:copier', 'pages:compile'], cb);
});

gulp.task('pages:build:cleanup', function (cb) {
  runSequence(['pages:copier:cleanup', 'pages:compile:cleanup'], cb);
});


gulp.task('pages:dist', function (cb) {
  runSequence('pages:build', cb);
});

gulp.task('pages:dist:cleanup', function (cb) {
  runSequence('pages:dist:cleanup', cb);
});


gulp.task('pages:watch', function () {
  server = serverUtils.runServer(serverConfig.devServerName);

  gulp.watch(pagesConfig.src, ['pages:compile']);

  var copiers = getObject.get(pagesConfig, 'copier');
  if (copiers) {
    copiers = (!_.isArray(copiers)) ? [copiers] : copiers;
    copiers = _.map(copiers, __.getCopier);

    var copyWatchers = [];
    _.each(copiers, function (copier) {
      copyWatchers = copyWatchers.concat(copier.from);
    });
    copyWatchers.length && gulp.watch(copyWatchers, ['pages:copier']);
  }
});
