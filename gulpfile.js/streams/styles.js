'use strict';

const $              = require('gulp-load-plugins')();
const _              = require('lodash');
const __             = require('../helpers');
const sass           = require('node-sass');
const config         = require('../../scaffront.config.js');
const combiner       = require('stream-combiner2').obj;
const path           = require('path');
const isUrl          = require('is-url');
const resolve        = require('resolve');
const bowerDirectory = require('bower-directory').sync();

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
        bower: false
      },
      functions: {
        //'url($url)': function(url, done) {
        //
        //  console.log('url', url.getValue());
        //  console.log('this', this);
        //  console.log('this.options', this.options);
        //  //console.log(this.options.stats);
        //  //console.log(this.options.context);
        //
        //  console.log('=================');
        //
        //  done(new sass.types.String(url.getValue()));
        //
        //  //processor.image_url(filename.getValue(), function(url) {
        //  //  if(!only_path.getValue()) url = 'url(\'' + url + '\')';
        //  //  done(new sass.types.String(url));
        //  //});
        //},
        '__url($filepath, $url)': function(filepath, url, done) {

          //console.log('filepath', filepath.getValue());
          //console.log('url', url.getValue());
          //console.log('this', this);
          //console.log('this.options', this.options);
          //console.log(this.options.stats);
          //console.log(this.options.context);

          console.log('=================');

          url = url.getValue();

          if (isUrl(url)) { return url; }

          if (path.isAbsolute(filepath)) {
            return path.join(process.cwd(), filepath);
          }

          url = resolve.sync(url, {
            basedir:         path.dirname(filepath),
            moduleDirectory: bowerDirectory ? ['node_modules', bowerDirectory] : ['node_modules']
          });


          done(new sass.types.String('url('+ url +')'));

          //processor.image_url(filepath.getValue(), function(url) {
          //  if(!only_path.getValue()) url = 'url(\'' + url + '\')';
          //  done(new sass.types.String(url));
          //});
        },
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
    })
  );
};

module.exports = streams;