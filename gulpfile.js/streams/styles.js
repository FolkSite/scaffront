const $        = require('gulp-load-plugins')();
const _        = require('lodash');
const __       = require('../helpers');
const envs     = require('../../scaffront.env.js');
const lazypipe = require('lazypipe');


var streams = {};

streams.css = function () {
  return lazypipe()
    .pipe($.plumber({
      errorHandler: $.notify.onError(err => ({
        title:   'CSS',
        message: err.message
      }))
    }))
    .pipe($.postcss([
      require("postcss-import")
    ]))
  ;
};

streams.scss = function () {
  return lazypipe()
    .pipe($.plumber({
      errorHandler: $.notify.onError(err => ({
        title:   'SCSS',
        message: err.message
      }))
    }))
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
};

module.exports = streams;