'use strict';

const $              = require('gulp-load-plugins')();
const _              = require('lodash');
const __             = require('../helpers');
const sass           = require('node-sass');
const config         = require('../../scaffront.config.js');
const combiner       = require('stream-combiner2').obj;
const path           = require('path');
const resolve        = require('resolve');

var streams = {};

streams.css = function (options) {
  options = (_.isPlainObject(options)) ? options : {};

  var stream = combiner(
    $.sourcemaps.init({
      loadMaps: true
    })
  );

  if (options.postcss) {
    stream = combiner(stream, $.postcss(options.postcss))
  }

  return stream;
};

streams.scss = function (options) {
  options = (_.isPlainObject(options)) ? options : {};

  return combiner(
    $.sourcemaps.init({
      loadMaps: true
    }),
    $.sass({
      precision: 10,
      importer: require('node-sass-import-once'),
      importOnce: {
        index: true,
        css: true,
        bower: false,
        /**
         * @param {string} filename
         * @param {string} contents
         * @returns {string}
         */
        transformContent: function (filename, contents) {
          return [
            '$__filepath: unquote("'+ filename +'");',
            '@function url($url: null, $args...) {',
            '  @return __url($__filepath, $url);',
            '}',
            contents
          ].join('\n');
        }
      },
      functions: {
        '__url($filepath, $url)': function(filepath, url, done) {
          url = url.getValue();
          filepath = filepath.getValue();

          url = __.nodeResolve(url, path.dirname(filepath));

          done(new sass.types.String('url('+ url +')'));
        }
      }
    })
  );
};

module.exports = streams;
