var Helpers = require('../../helpers/index.js');
var config = require('../config.js');

var Gulp = require('gulp');
var Changed = require('gulp-changed');
var RunSequence = require('run-sequence').use(Gulp);
var Plumber = require('gulp-plumber');
var Del = require('del');

var Twig = require('gulp-twig');
var Foreach = require('gulp-foreach');
var FS = require('fs');


Gulp.task('twig:compile', function () {
  var SRC = 'app/twig/**/*.twig';
  var DEST = 'dist/compile/';
  return Gulp.src(SRC)
    .pipe(Plumber(Helpers.plumberErrorHandler))
    .pipe(Changed(DEST))
    .pipe(Foreach(function (stream, file) {
      var dataFile,
          data = {},
          path = file.path,
          matches = path.match(/(.+)\.twig$/);

      if (matches && matches[1]) {
        dataFile = matches[1] +'-data.js';
        if (FS.existsSync(dataFile)) {
          data = require(dataFile);
        }
      }

      return stream.pipe(Twig({data: data}));
    }))
    .pipe(Gulp.dest(DEST));
});


Gulp.task('twig:copy:templates', function () {
  var SRC = 'app/twig/**/*.twig';
  var DEST = 'dist/tpl';
  return Gulp.src(SRC)
    .pipe(Plumber(Helpers.plumberErrorHandler))
    .pipe(Gulp.dest(DEST));
});

Gulp.task('twig:copy:root', function () {
  var SRC = 'dist/compile/*.html';
  var DEST = 'dist';

  return Gulp.src(SRC)
    .pipe(Plumber(Helpers.plumberErrorHandler))
    .pipe(Changed(SRC))
    .pipe(Gulp.dest(DEST));
});

Gulp.task('twig:copy', function (cb) {
  return RunSequence(
    ['twig:compile', 'twig:copy:templates'],
    'twig:copy:root',
    cb
  );
});


Gulp.task('twig:copy:templates:cleanup', function () {
  var SRC = 'dist/tpl';
  return Del([SRC]);
});

Gulp.task('twig:copy:root:cleanup', function () {
  var SRC = 'dist/*.html';
  return Del([SRC]);
});

Gulp.task('twig:copy:cleanup', function (cb) {
  RunSequence(
    'twig:copy:root:cleanup',
    'twig:copy:templates:cleanup',
    cb
  );
});

Gulp.task('twig:compile:cleanup', function () {
  var SRC = 'dist/compile';
  return Del([SRC]);
});

Gulp.task('twig:cleanup', ['twig:copy:cleanup', 'twig:compile:cleanup']);


Gulp.task('twig:build', function (cb) {
  RunSequence(
    'twig:compile',
    'twig:copy',
    cb
  );
});

Gulp.task('twig:dist', function (cb) {
  RunSequence(
    'twig:cleanup',
    'twig:build',
    cb
  );
});

