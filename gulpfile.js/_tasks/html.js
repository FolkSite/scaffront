var Helpers = require('../../helpers/index.js');
var config = require('../config.js');

var _ = require('lodash');
var Gulp = require('gulp');
var Changed = require('gulp-changed');
var RunSequence = require('run-sequence').use(Gulp);
var Plumber = require('gulp-plumber');
var Del = require('del');
var Gutil = require('gulp-util');
var Foreach = require('gulp-foreach');

var NunjucksRender = require('gulp-nunjucks-render');
var NunjuckFilters = require('../../helpers/nunjucks.filters.js');
var Data = require('gulp-data');


var SRC = 'app/test-html';
var DEST_RENDER = 'dist';
var DEST_COPY = 'dist/tpls';

SRC = Helpers.preparePath({trailingSlash: true}, SRC);
DEST_RENDER = Helpers.preparePath({trailingSlash: true}, DEST_RENDER);
DEST_COPY = Helpers.preparePath({trailingSlash: true}, DEST_COPY);



Gulp.task('html:tpl:render', function () {
  var env = NunjucksRender.nunjucks.configure([SRC], {
    watch: false
  });

  _.each(NunjuckFilters, function (method, methodName) {
    env.addFilter(methodName, method);
  });

  var getTplData = Helpers.getDataForTpl('-data', '.js');

  return Gulp.src([SRC +'*.tpl', SRC +'*.html'])
    .pipe(Plumber(Helpers.plumberErrorHandler))
    .pipe(Changed(DEST_RENDER, {extension: '.html'}))
    .pipe(Data(getTplData))
    .pipe(NunjucksRender({
      Config: config
    }))
    .pipe(Gulp.dest(DEST_RENDER));
});

Gulp.task('html:tpl:render:cleanup', function () {
  var SRC = DEST_RENDER;

  return Del([SRC +'*.html']);
});


Gulp.task('html:tpl:copy', function () {

  return Gulp.src(SRC +'**/*.*')
    .pipe(Plumber(Helpers.plumberErrorHandler))
    .pipe(Changed(DEST_COPY))
    .pipe(Gulp.dest(DEST_COPY));
});

Gulp.task('html:tpl:copy:cleanup', function () {
  var SRC = DEST_COPY;

  return Del([SRC]);
});


Gulp.task('html:tpl:cleanup', function (cb) {
  RunSequence(
    ['html:tpl:render:cleanup', 'html:tpl:copy:cleanup'],
    cb
  );
});


Gulp.task('html:cleanup', function (cb) {
  RunSequence(
    ['html:tpl:cleanup'],
    cb
  );
});


//Gulp.task('html:build', function () {
//
//  return Gulp.src(SRC +'**/*.*')
//    .pipe(Plumber(Helpers.plumberErrorHandler))
//    .pipe(Gulp.dest(DEST_COPY));
//});
//
//Gulp.task('html:dist', function () {
//
//  return Gulp.src(SRC +'**/*.*')
//    .pipe(Plumber(Helpers.plumberErrorHandler))
//    .pipe(Gulp.dest(DEST_COPY));
//});
//
//Gulp.task('html:cleanup', function () {
//
//  return Gulp.src(SRC +'**/*.*')
//    .pipe(Plumber(Helpers.plumberErrorHandler))
//    .pipe(Gulp.dest(DEST_COPY));
//});

