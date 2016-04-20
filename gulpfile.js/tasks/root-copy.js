'use strict';
const $ = require('gulp-load-plugins')();
const gulp = require('gulp');
const combiner = require('stream-combiner2').obj;
const config = require('../config');

module.exports = function(options) {
  return function() {
    return combiner(
      gulp.src(options.src, {
        // При повторном запуске таска (например, через watch) выбирает только те файлы,
        // которые изменились с заданной даты (сравнивает по дате модификации mtime)
        since: gulp.lastRun(options.taskName)
      }),
      // $.newer сравнивает проходящие через него файлы с файлами в целевой директории и,
      // если в целевой директории такие файлы уже есть, то не пропускает их.
      // по логике, since работает после второго запуска, а $.newer сразу же, при первом.
      // у $.newer'а можно замапить сравнение исходных файлов с целевыми.
      $.newer(options.dist),
      $.if(config.flags.isDev, $.debug({title: 'Root file:'})),

      gulp.dest(options.dist)
    ).on('error', $.notify.onError(err => ({
      title: 'Copy root files',
      message: err.message
    })));
  };
};
