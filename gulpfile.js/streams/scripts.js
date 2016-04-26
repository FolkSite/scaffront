'use strict';

const $        = require('gulp-load-plugins')();
const _        = require('lodash');
const __       = require('../helpers');
const path     = require('path');
const config   = require('../../scaffront.config.js');
const slice    = require('sliced');
const combiner = require('stream-combiner2').obj;

const named         = require('vinyl-named');
const webpackStream = require('webpack-stream');
const webpack       = webpackStream.webpack;

let streams = {};

streams.webpack = function (options, cb) {
  let args = slice(arguments);

  if (args.length == 1 && _.isFunction(args[0])) {
    cb = options;
  }

  options = (_.isPlainObject(options)) ? args[0] : {};
  cb = (_.isFunction(cb)) ? cb : __.noop;

  return combiner(
    named(),
    webpackStream(options, null, cb)
  );
};


module.exports = streams;
