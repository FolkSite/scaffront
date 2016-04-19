'use strict';
const $ = require('gulp-load-plugins')();
const gulp = require('gulp');

module.exports = function(options) {
  return function() {
    return gulp
      .src(options.src, {
        // При повторном запуске таска отметает неизменившиеся файлы, сравнивая их по дате модификации mtime
        // но с mtime'ом бывают проблемы, поэтому лучше использовать $.cached
        //since: gulp.lastRun(options.taskName)
      })
      .pipe($.plumber({
        errorHandler: $.notify.onError(err => ({
          title: 'CSS styles',
          message: err.message
        }))
      }))
      // При повторном запуске таска отметает неизменившиеся файлы, сравнивая их по названию файла и содержимому
      // (замена since, но since быстрее, потому что ему не нужно полностью читать файл)
      .pipe($.cached('css'))
      // $.remember запоминает все файлы, которые через него проходят, в своём внутреннем кеше ('css' - это ключ кеша)
      // и потом, если в потоке они отсутствуют, добавляет их.
      // но если какой-то файл из src-потока удалён с диска, то $.remember всё-равно будет его восстанавливать.
      // для избежания подобного поведения, в watch-таске заставляем $.remember забыть об удалённых файлах.
      .pipe($.remember('css'))
      .pipe($.debug({title: 'CSS style'}))
      .pipe($.include())
      .pipe(gulp.dest(options.dist));
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
