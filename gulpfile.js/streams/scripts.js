'use strict';

const $        = require('gulp-load-plugins')();
const _        = require('lodash');
const __       = require('../helpers');
const path     = require('path');
const config   = require('../../scaffront.config.js');
const slice    = require('sliced');
const combiner = require('stream-combiner2').obj;
const through  = require('through2').obj;

const named         = require('vinyl-named');
const webpackStream = require('webpack-stream');
//const webpack       = webpackStream.webpack;

let streams = {};

streams.webpack = function (opts, webpack, cb) {
  let args = slice(arguments);

  if (args.length == 1 && _.isFunction(args[0])) {
    cb = opts;
  }

  opts = (_.isPlainObject(opts)) ? args[0] : {};
  cb = (_.isFunction(cb)) ? cb : __.noop;

  return combiner(
    $.plumber({
      errorHandler: $.notify.onError(err => ({
        title:   'Webpack',
        message: err.message
      }))
    }),
    named(),
    webpackStream(opts, webpack, cb)
  );
};


module.exports = streams;
