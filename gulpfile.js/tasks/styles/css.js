'use strict';
const $ = require('gulp-load-plugins')();
const gulp = require('gulp');

module.exports = function(options) {
  return function() {
    return gulp
      .src(options.src, {
        //since: gulp.lastRun(options.taskName)
      })
      .pipe($.plumber({
        errorHandler: $.notify.onError(err => ({
          title: 'CSS styles',
          message: err.message
        }))
      }))
      .pipe($.debug({title: 'CSS style'}))
      // $.remember запоминает все файлы, которые через него проходят, в своём внутреннем кеше ('css' - это ключ кеша)
      // и потом, если в потоке они отсутствуют, добавляет их
      .pipe($.remember('css'))
      .pipe($.include())
      .pipe(gulp.dest(options.dist));
  };
};


//gulp.task('watch', function () {
//  gulp
//    .watch(__.getGlob('app/frontend/styles/', '*.css', true), gulp.series('styles:css'))
//    .on('unlink', function (filepath) {
//      $.remember.forget('css', path.resolve(filepath))
//    });
//});
