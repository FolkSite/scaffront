var Helpers = require('../helpers/index.js');
var config = require('../config.js');

var Gulp = require('gulp');
var Changed = require('gulp-changed');
var RunSequence = require('run-sequence').use(Gulp);
var Plumber = require('gulp-plumber');
var Del = require('del');
var Gutil = require('gulp-util');
var Base64Font = require('gulp-base64-webfont-css');


Gulp.task('fonts:test', function () {
  var SRC = 'app/fonts-tocss/**/*.*';
  var DEST = 'dist/styles/fonts';

  return Gulp.src(SRC)
    .pipe(Plumber(Helpers.plumberErrorHandler))
    .pipe(Changed(DEST))
    .pipe(Base64Font())
    .pipe(Gulp.dest(DEST));
});


Gulp.task('fonts:build', function () {
  return Gulp.src(paths.src.fonts)
    .pipe(Plumber(Helpers.plumberErrorHandler))
    .pipe(Gulp.dest(paths.dist.fonts));
});
Gulp.task('fonts:dist', function (cb) {
  return RunSequence('fonts:build', cb);
});

