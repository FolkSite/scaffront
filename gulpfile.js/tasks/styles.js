'use strict';

const $  = require('gulp-load-plugins')();
const _  = require('lodash');
const __ = require('../helpers');

module.exports = function (options) {
  options = (_.isPlainObject(options)) ? options : {};

  var cssStream = gulp
    .src(__.getGlob(options.src, ['*.css', '!_*.css'], true), {
      //since: gulp.lastRun(options.taskName)
    })
    .pipe($.postcss([
      require("postcss-import")
    ]))
  ;

  var scssStream = gulp
    .src(__.getGlob(options.src, ['*.scss', '!_*.scss'], true), {
      //since: gulp.lastRun(options.taskName)
    })
    .pipe($.sass({
      precision: 10,
      importer: require('node-sass-import-once'),
      importOnce: {
        index: true,
        css: true,
        bower: false
      },
      //functions: assetFunctions({
      //  images_path: (global.isProduction) ? 'dist/i' : 'app/images/inline',
      //  images_dir:  (global.isProduction) ? 'dist/i' : 'app/images/inline',
      //  http_images_path: '/i',
      //  http_generated_images_path: '/i',
      //}),
      //sourceMap: './',
      //sourceMapContents: true,
      //omitSourceMapUrl: true
    }))
    ;

  return combine(
    merge(cssStream, scssStream),

    $.cached('styles'),

    $.if(config.env.isDev, $.debug({title: 'Style:'})),

    gulp.dest(options.dist)
  )
    .on('error', $.notify.onError(err => ({
      title: 'CSS styles',
      message: err.message
    })));
};