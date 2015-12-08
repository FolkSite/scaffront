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
    gulpIf           = require('gulp-if'),
    getObject        = require('getobject'),
    gulpChanged      = require('gulp-changed'),
    runSequence      = require('run-sequence').use(gulp),
    gulpPlumber      = require('gulp-plumber'),
    gulpRename       = require('gulp-rename'),
    gulpFile         = require('gulp-file'),
    gulpData         = require('gulp-data'),
    lazypipe         = require('lazypipe'),
    //gulpUmd          = require('gulp-umd'),
    gulpSwig         = require('gulp-swig-compiler-renderer')
  ;

var Config       = require('../_config').templates,
    ServerConfig = require('../_config').server;



var gulpConsolidate = require("gulp.consolidate");


gulp.task('html:consolidate', function (cb) {
  return gulp.src(Config.render.src)
    .pipe(gulpPlumber(__.plumberErrorHandler))
    .pipe(gulpData(Config.getTplData))
    .pipe(gulpConsolidate("swig", Config.globalData || {}, {
      setupEngine: function (engine, Engine) {
        return Engine;
      }
      //useContents: true
    }))
    .pipe(gulpRename({extname: '.html'}))
    .pipe(gulp.dest(Config.render.dest));
});

/**
 * gulp tasks
 */

gulp.task('swig:render', function () {

  return __.getGulpSrc(Config.render.src)
    .pipe(gulpPlumber(__.plumberErrorHandler))
    //.pipe(gulpChanged(Config.dest.render, {extension: '.html'}))

    .pipe(gulpData(Config.getTplData))
    .pipe(gulpSwig(Config.render.swig))
    .pipe(gulpRename({extname: '.html'}))
    .pipe(gulp.dest(Config.render.dest))
  ;
});

gulp.task('swig:render:cleanup', function () {
  return del(__.getGlobPaths(Config.render.dest, '.html'));
});


gulp.task('swig:compile', function () {

  return __.getGulpSrc(Config.compile.src)
    .pipe(gulpPlumber(__.plumberErrorHandler))
    //.pipe(gulpChanged(Config.dest.render, {extension: '.js'}))

    .pipe(gulpSwig(Config.compile.swig))
    .pipe(gulpRename({extname: '.js'}))
    .pipe(gulp.dest(Config.compile.dest))
  ;
});


gulp.task('swig:compile:cleanup', function () {
  return del(__.getGlobPaths(config.dest.compile, '.js'));
});


gulp.task('swig:data', function () {

  var globalDataStream = lazypipe();
  if (config.data.globalVarsDistFilename) {
    var str = JSON.stringify(config.globalVars, null, 2);

    globalDataStream = gulpFile(config.data.globalVarsDistFilename, str, {src: true});
  }

  var allDataStream = gulp.src(__.getGlobPaths(config.src, config.extnames))
    .pipe(gulpPlumber(__.plumberErrorHandler))
    .pipe(gulpChanged(config.dest.data, {extension: '.json'}))

    .pipe(gulpData(config.getTplData))
    .pipe(gulpTap(function (file) {
      var data = file.data;

      if (_.isPlainObject(data)) {
        file.contents = new Buffer(JSON.stringify(data, null, 2), 'utf8');
      }
    }));

  return mergeStreams(globalDataStream, allDataStream)
    .pipe(gulpRename({
      extname: '.json'
    }))
    .pipe(gulp.dest(config.dest.data));
});

gulp.task('swig:data:cleanup', function () {
  return del(__.getGlobPaths(config.dest.data, '.json'));
});





gulp.task('swig', ['swig:build']);
gulp.task('swig:build', function (cb) {
  runSequence(
    ['swig:render', 'swig:compile', 'swig:data'],
    cb
  );
});

gulp.task('swig:dist', function (cb) {
  runSequence(
    'swig:cleanup',
    ['swig:render', 'swig:compile:min', 'swig:data'],
    cb
  );
});


gulp.task('swig:cleanup', ['swig:data:cleanup', 'swig:compile:cleanup', 'swig:render:cleanup'], function () {
  return del([config.dest.data, config.dest.render, config.dest.compile]);
});


gulp.task('swig:watch', function (cb) {
  //runSequence(
  //  ['jade:render', 'jade:compile:min', 'jade:data'],
  //  cb
  //);

  cb();
});

