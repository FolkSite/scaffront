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
          title: 'CSS styles',
          message: err.message
        }))
      }))
      .pipe(gulp.dest(options.dist));
  };

};
