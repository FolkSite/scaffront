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
        //since: gulp.lastRun(options.taskName)
      }),
      // При повторном запуске таска выбирает только те файлы, которые изменились с прошлого запуска (сравнивает по названию файла и содержимому)
      // $.cached - это замена since, но since быстрее, потому что ему не нужно полностью читать файл.
      // Но since криво работает с ранее удалёнными и только что восстановленными через ctrl+z файлами.
      $.cached('root-files'),

      // $.newer сравнивает проходящие через него файлы с файлами в _целевой_ директории и,
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
