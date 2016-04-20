'use strict';
const $ = require('gulp-load-plugins')();
const gulp = require('gulp');
const combiner = require('stream-combiner2').obj;
const config = require('../../config');

/*
  Описание $.remember, $.cached здесь:
  https://youtu.be/uYZPNrT-e-8?t=240
*/


module.exports = function(options) {
  return function() {
    return combiner(
      gulp.src(options.src, {
        since: gulp.lastRun(options.taskName)
      }),
      // При повторном запуске таска выбирает только те файлы, которые изменились с прошлого запуска (сравнивает по названию файла и содержимому)
      // $.cached - это замена since, но since быстрее, потому что ему не нужно полностью читать файл.
      // Но since криво работает с ранее удалёнными и только что восстановленными через ctrl+z файлами.
      $.cached('css'),

      // $.remember запоминает все файлы, которые через него проходят, в своём внутреннем кеше ('css' - это ключ кеша)
      // и потом, если в потоке они отсутствуют, добавляет их
      // (это может произойти, если перед ним установлен since/$.newer - они пропускают только изменённые файлы, исключая из gulp.src не изменившееся).
      // но если какой-то файл из src-потока удалён с диска, то $.remember всё-равно будет его восстанавливать.
      // для избежания подобного поведения, в watch-таске заставляем $.remember забыть об удалённых файлах.
      $.remember('css'),
      $.if(config.flags.isDev, $.debug({title: 'CSS style:'})),

      // инклюдим файлы
      $.include(),

      // если сборка для продакшна, то пропускаем через autoprefixer
      $.if(config.flags.isProd, $.autoprefixer()),

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
