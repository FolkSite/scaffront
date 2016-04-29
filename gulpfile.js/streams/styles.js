'use strict';

const $        = require('gulp-load-plugins')();
const _        = require('lodash');
const __       = require('../helpers');
const sass     = require('node-sass');
const config   = require('../../scaffront.config.js');
const path     = require('path');
const postcss  = require('postcss');
const resolve  = require('resolve');
const combiner = require('stream-combiner2').obj;
const through2 = require('through2').obj;

var streams = {};

streams.css = function (options) {
  options = (_.isPlainObject(options)) ? options : {};

  var assets = {};

  var stream = combiner(
    $.sourcemaps.init({
      loadMaps: true
    }),
    $.postcss([
      require('postcss-import')({
        //root: path.join(process.cwd(), config.tasks.root),
        resolve: function (module, basedir, importOptions) {
          return __.nodeResolve(module, basedir);
        },
        transform: function(css, filepath, options) {
          console.log('filepath', filepath);
          console.log('options', options);

          return postcss([
            require('postcss-url')({
              url: function (url, decl, from, dirname, to, options, result) {
                console.log('url', url);
                console.log('from', from);
                console.log('dirname', dirname);
                console.log('to', to);
                console.log('options', options);
                console.log('result', result);

                //file = path.join(path.dirname(file), path.basename(file, path.extname(file)));
                //
                //assets[file] = assets[file] || [];
                //assets[file].push(url);

                return __.nodeResolve(url, path.dirname(filepath));
              }
            })
          ])
            .process(css)
            .then(function(result) {
              return result.css;
            });
        }
      })
    ])
  );

  return stream;
};

streams.scss = function (options) {
  options = (_.isPlainObject(options)) ? options : {};

  var assets = {};

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
            '@function url($url: null) {',
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

          if (!url) {
            url = '""';
          } else {
            url = __.nodeResolve(url, path.dirname(filepath));

            let file = this.options.file;

            file = path.join(path.dirname(file), path.basename(file, path.extname(file)));

            assets[file] = assets[file] || [];
            assets[file].push(url);
          }

          done(new sass.types.String('url('+ url +')'));
        }
      }
    }),
    through2(
      function(file, enc, callback) {
        var filepath = path.join(file.base, file.stem);

        file.assets = assets[filepath];
        callback(null, file);
      },
      function(callback) {
        //let manifest = new File({
        //  // cwd base path contents
        //  contents: new Buffer(JSON.stringify(mtimes)),
        //  base: process.cwd(),
        //  path: process.cwd() + '/manifest.json'
        //});
        //this.push(manifest);
        console.log('assets', assets);
        callback();
      }
    )
  );
};

module.exports = streams;
