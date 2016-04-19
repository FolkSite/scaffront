'use strict';
const $ = require('gulp-load-plugins')();
const gulp = require('gulp');

module.exports = function(options) {
  return function() {
    return gulp
      .src(options.src, {
        since: gulp.lastRun(options.taskName)
      })
      .pipe($.plumber({
        errorHandler: $.notify.onError(err => ({
          title: 'Copy root files',
          message: err.message
        }))
      }))
      // фильтр - если файлы здесь уже проходили и с прошлого раза они не изменились,
      // то $.newer их не пропускает
      .pipe($.newer(options.dist))
      .pipe($.debug({title: 'CSS style'}))
      .pipe(gulp.dest(options.dist));
  };
};
