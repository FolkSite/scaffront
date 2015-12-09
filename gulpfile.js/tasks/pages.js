// https://github.com/osscafe/gulp-cheatsheet/blob/master/examples/js/stream-array.js
// https://www.npmjs.com/login?done=/package/gulp-consolidate

var _                = require('lodash'),
    __               = require('../helpers'),
    extend           = require('extend'),
    path             = require('path'),
    gulp             = require('gulp'),
    gulpUtil         = require('gulp-util'),
    gulpTap          = require('gulp-tap'),
    mergeStreams     = require('event-stream').merge,
    del              = require('del'),
    getObject        = require('getobject'),
    gulpChanged      = require('gulp-changed'),
    runSequence      = require('run-sequence').use(gulp),
    gulpPlumber      = require('gulp-plumber'),
    gulpRename       = require('gulp-rename'),
    gulpFile         = require('gulp-file'),
    gulpData         = require('gulp-data'),
    lazypipe         = require('lazypipe'),
    //gulpUmd          = require('gulp-umd'),
    gulpConsolidate  = require('gulp.consolidate')
  ;

var server       = null,
    config       = require('../_config'),
    pagesConfig  = config.pages.config,
    pagesUtils   = config.pages.utils,
    copierUtils  = config.copier.utils,
    serverConfig = config.server.config,
    serverUtils  = config.server.utils;


gulp.task('pages:copier', function (cb) {
  var result = copierUtils.copy(getObject.get(pagesConfig, 'copier'));

  if (typeof result != 'undefined') {
    server && serverUtils.reloadServer(serverConfig.devServerName);

    return result;
  }
});

gulp.task('pages:copier:cleanup', function (cb) {
  return copierUtils.cleanup(getObject.get(pagesConfig, 'copier'));
});


gulp.task('pages:compile', function (cb) {
  var stream = gulp.src(pagesConfig.src)
    .pipe(gulpPlumber(__.plumberErrorHandler))
  ;

  if (getObject.get(pagesConfig, 'transform') && _.isFunction(pagesConfig.transform)) {
    var tmp = pagesConfig.transform(stream, cb);
    stream = (gulpUtil.isStream(tmp)) ? tmp : stream;
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

  var copiers = __.getCopier(getObject.get(pagesConfig, 'copier'));
  var copyWatchers = [];
  _.each(copiers, function (copier) {
    copyWatchers = copyWatchers.concat(copier.from);
  });
  copyWatchers.length && gulp.watch(copyWatchers, ['pages:copier']);
});






//var gulpConsolidate = require("gulp.consolidate");
//
//
//gulp.task('html:consolidate', function (cb) {
//  return gulp.src(Config.render.src)
//    .pipe(gulpPlumber(__.plumberErrorHandler))
//    .pipe(gulpData(Config.getTplData))
//    .pipe(gulpConsolidate("swig", Config.globalData || {}, {
//      setupEngine: function (engine, Engine) {
//        return Engine;
//      }
//      //useContents: true
//    }))
//    .pipe(gulpRename({extname: '.html'}))
//    .pipe(gulp.dest(Config.render.dest));
//});
//
///**
// * gulp tasks
// */
//
//gulp.task('swig:render', function () {
//
//  return __.getGulpSrc(Config.render.src)
//    .pipe(gulpPlumber(__.plumberErrorHandler))
//    //.pipe(gulpChanged(Config.dest.render, {extension: '.html'}))
//
//    .pipe(gulpData(Config.getTplData))
//    .pipe(gulpSwig(Config.render.swig))
//    .pipe(gulpRename({extname: '.html'}))
//    .pipe(gulp.dest(Config.render.dest))
//  ;
//});
//
//gulp.task('swig:render:cleanup', function () {
//  return del(__.getGlobPaths(Config.render.dest, '.html'));
//});
//
//
//gulp.task('swig:compile', function () {
//
//  return __.getGulpSrc(Config.compile.src)
//    .pipe(gulpPlumber(__.plumberErrorHandler))
//    //.pipe(gulpChanged(Config.dest.render, {extension: '.js'}))
//
//    .pipe(gulpSwig(Config.compile.swig))
//    .pipe(gulpRename({extname: '.js'}))
//    .pipe(gulp.dest(Config.compile.dest))
//  ;
//});
//
//
//gulp.task('swig:compile:cleanup', function () {
//  return del(__.getGlobPaths(config.dest.compile, '.js'));
//});
//
//
//gulp.task('swig:data', function () {
//
//  var globalDataStream = lazypipe();
//  if (config.data.globalVarsDistFilename) {
//    var str = JSON.stringify(config.globalVars, null, 2);
//
//    globalDataStream = gulpFile(config.data.globalVarsDistFilename, str, {src: true});
//  }
//
//  var allDataStream = gulp.src(__.getGlobPaths(config.src, config.extnames))
//    .pipe(gulpPlumber(__.plumberErrorHandler))
//    .pipe(gulpChanged(config.dest.data, {extension: '.json'}))
//
//    .pipe(gulpData(config.getTplData))
//    .pipe(gulpTap(function (file) {
//      var data = file.data;
//
//      if (_.isPlainObject(data)) {
//        file.contents = new Buffer(JSON.stringify(data, null, 2), 'utf8');
//      }
//    }));
//
//  return mergeStreams(globalDataStream, allDataStream)
//    .pipe(gulpRename({
//      extname: '.json'
//    }))
//    .pipe(gulp.dest(config.dest.data));
//});
//
//gulp.task('swig:data:cleanup', function () {
//  return del(__.getGlobPaths(config.dest.data, '.json'));
//});
//
//
//
//
//
//gulp.task('swig', ['swig:build']);
//gulp.task('swig:build', function (cb) {
//  runSequence(
//    ['swig:render', 'swig:compile', 'swig:data'],
//    cb
//  );
//});
//
//gulp.task('swig:dist', function (cb) {
//  runSequence(
//    'swig:cleanup',
//    ['swig:render', 'swig:compile:min', 'swig:data'],
//    cb
//  );
//});
//
//
//gulp.task('swig:cleanup', ['swig:data:cleanup', 'swig:compile:cleanup', 'swig:render:cleanup'], function () {
//  return del([config.dest.data, config.dest.render, config.dest.compile]);
//});
//
//
//gulp.task('swig:watch', function (cb) {
//  //runSequence(
//  //  ['jade:render', 'jade:compile:min', 'jade:data'],
//  //  cb
//  //);
//
//  cb();
//});
//
