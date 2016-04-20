'use strict';
const $ = require('gulp-load-plugins')();
const gulp = require('gulp');
const combiner = require('stream-combiner2').obj;

module.exports = function(options) {
  return function() {
    return combiner(
      gulp.src(options.src, {
        since: gulp.lastRun(options.taskName)
      }),
      // При повторном запуске таска выбирает только те файлы, которые изменились с заданной даты (сравнивает по названию файла и содержимому)
      // (замена since, но since быстрее, потому что ему не нужно полностью читать файл)
      $.cached('css'),
      // $.remember запоминает все файлы, которые через него проходят, в своём внутреннем кеше ('css' - это ключ кеша)
      // и потом, если в потоке они отсутствуют, добавляет их.
      // но если какой-то файл из src-потока удалён с диска, то $.remember всё-равно будет его восстанавливать.
      // для избежания подобного поведения, в watch-таске заставляем $.remember забыть об удалённых файлах.
      //$.autoprefixer(),
      $.remember('css'),
      $.debug({title: 'CSS style'}),
      $.include(),
      gulp.dest(options.dist)
    ).on('error', $.notify.onError(err => ({
      title: 'CSS styles',
      message: err.message
    })));
  };
};

//gulp.task('watch', function () {
//  gulp
//    .watch(__.getGlob('app/frontend/styles/', '*.css', true), gulp.series('styles:css'))
//    .on('unlink', function (filepath) {
//      $.remember.forget('css', path.resolve(filepath));
//      delete $.cached.caches.css[path.resolve(filepath)];
//    });
//});
