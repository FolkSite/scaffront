'use strict';
const $ = require('gulp-load-plugins')();
const gulp = require('gulp');
const combiner = require('stream-combiner2').obj;

module.exports = function(options) {
  return function() {
    return combiner(
      gulp.src(options.src, {
        //since: gulp.lastRun(options.taskName)
      }),
      // фильтр - если файлы здесь уже проходили и с прошлого раза они не изменились,
      // то $.newer их не пропускает
      $.newer(options.dist),
      $.debug({title: 'CSS style'}),
      gulp.dest(options.dist)
    ).on('error', $.notify.onError(err => ({
      title: 'Copy root files',
      message: err.message
    })));
  };
};
