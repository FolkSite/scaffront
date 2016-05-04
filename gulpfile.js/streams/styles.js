'use strict';

const $        = require('gulp-load-plugins')();
const _        = require('lodash');
const __       = require('../helpers');
const sass     = require('node-sass');
const path     = require('path');
const gulp     = require('gulp');
const isUrl    = require('is-url');
const gutil    = require('gulp-util');
const config   = require('../../scaffront.config.js');
const extend   = require('extend');
const postcss  = require('postcss');
const resolve  = require('resolve');
const combiner = require('stream-combiner2').obj;
const through2 = require('through2').obj;
const applySourceMap = require('vinyl-sourcemaps-apply');

var streams = {};

function isUrlShouldBeIgnored(url) {
  return url[0] === "/" ||
    url[0] === "#" ||
    url.indexOf("data:") === 0 ||
    isUrl(url) ||
    /^[a-z]+:\/\//.test(url)
}

/**
 * @param {string} url
 * @param {{}} assetsStorage Объект
 * @param {string} entryFilepath Точка входа. Для неё сохраняются ассеты из всех импортируемых файлов
 * @param {string} [filepath] Ипортируемый файл, у которого надо зарезолвить урлы
 * @param {function} [assetsResolver]
 * @returns {string}
 */
var resolveAssets = function (url, assetsStorage, entryFilepath, filepath, assetsResolver) {
  var tmp = url;
  if (!isUrlShouldBeIgnored(url)) {
    tmp = __.nodeResolve(url, path.dirname(filepath), true);

    if (!__.nodeResolve.lastError) {
      url = tmp;
      url = path.relative(process.cwd(), url);
      assetsStorage[entryFilepath] = assetsStorage[entryFilepath] || {};
      assetsStorage[entryFilepath][url] = url;

      if (_.isFunction(assetsResolver)) {
        tmp = assetsResolver(url, entryFilepath);
        url = (tmp) ? tmp : url;
      }
    }
  }

  return url;
};

/**
 * @param {{}} assetsStorage Объект
 * @param {string} entryFilepath Точка входа. Для неё сохраняются ассеты из всех импортируемых файлов
 * @param {string} [filepath] Импортируемый файл, у которого надо зарезолвить урлы
 * @param {function} [assetsResolver]
 * @returns {string}
 */
var resolveAssetsPlugin = function (assetsStorage, entryFilepath, filepath, assetsResolver) {
  filepath = (!filepath) ? entryFilepath : filepath;

  return require('postcss-url')({
    url: function (url, decl, from, dirname, to, options, result) {
      return resolveAssets(url, assetsStorage, entryFilepath, filepath, assetsResolver || null);
    }
  })
};

function handleError (cb) {
  return function (error) {
    var errorOptions = { fileName: file.path };
    if (error.name === 'CssSyntaxError') {
      error = error.message + error.showSourceCode();
      errorOptions.showStack = false
    }
    // Prevent stream’s unhandled exception from
    // being suppressed by Promise
    cb && setImmediate(function () {
      cb(new gutil.PluginError('gulp-postcss', error))
    })
  };
}

streams.cssCompile = function (options) {
  options = (_.isPlainObject(options)) ? options : {};

  var assetsResolver = (_.isFunction(options.resolveAssetsUrl)) ? options.resolveAssetsUrl : __.noop;
  var assets = {};

  return combiner(
    // пропускаем каждую точку входа через свой поток-трансформер
    through2(function(file, enc, callback) {
      if (file.isNull()) {
        return cb(null, file)
      }

      if (file.isStream()) {
        return handleError(callback)('Streams are not supported!');
      }

      var opts = { map: false };

      if (file.sourceMap) {
        opts.map = { annotation: false };
      }

      opts.from = file.path;
      opts.to = opts.to || file.path;

      var entryFilepath = path.join(file.base, file.stem);

      postcss([
        // сперва сохраним все ассеты для точки входа
        resolveAssetsPlugin(assets, entryFilepath, entryFilepath, assetsResolver),
        // импортируем вложенные css-ки
        require('postcss-import')({
          // резолвим пути по стандарному для node.js алгоритму
          resolve: function (module, basedir, importOptions) {
            return __.nodeResolve(module, basedir);
          },
          // каждый импортированный файл тоже надо пропустить через postcss
          transform: function(css, filepath, options) {
            return postcss([
              // теперь сохраним все ассеты из импортируемых файлов
              resolveAssetsPlugin(assets, entryFilepath, filepath, assetsResolver)
            ])
              .process(css)
              .then(function(result) {
                return result.css;
              });
          }
        })
      ])
        .process(file.contents, opts)
        .then(function postcssHandleResult (result) {
          var map;
          var warnings = result.warnings().join('\n');

          file.contents = new Buffer(result.css);
          file.assets = Object.keys(assets[entryFilepath] || []);

          // Apply source map to the chain
          if (file.sourceMap) {
            map = result.map.toJSON();
            map.file = file.relative;
            map.sources = [].map.call(map.sources, function (source) {
              return path.join(path.dirname(file.relative), source)
            });
            applySourceMap(file, map)
          }

          if (warnings) {
            gutil.log('gulp-postcss:', file.relative + '\n' + warnings)
          }

          setImmediate(function () {
            callback(null, file)
          })
        }, handleError(callback));
    })
  );
};

var c = require('chalk');

streams.scssCompile = function (options) {
  options = (_.isPlainObject(options)) ? options : {};

  var assetsResolver = (_.isFunction(options.resolveAssetsUrl)) ? options.resolveAssetsUrl : __.noop;
  var assets = {};

  return combiner(
    through2(function(file, enc, callback) {
      console.log(c.blue('through2 entry file.path'), file.path);

      var contents = `
        $__filepath: unquote("${file.path}");
        @function url($url: null) {
          @return __url("$__filepath", $url);
        }
        ${file.contents.toString()}
      `;
      file.contents = Buffer.from(contents);

      //var filepath = path.join(file.base, file.stem);
      //
      ////console.log('filepath', file.path);
      ////console.log('assets', assets);
      //
      //file.assets = Object.keys(assets[file.path] || []);
      callback(null, file);
    }),
    $.sass({
      precision: 10,
      quiet: true,
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
          //contents.replace();
          return `
            $__filepath: unquote("${filename}");
            @function url($url: null) {
              @return __url($__filepath, $url);
            }
            ${contents}
          `;
        }
      },
      functions: {
        '__url($filepath, $url)': function(filepath, url, done) {
          url = url.getValue();
          filepath = filepath.getValue();
          console.log(c.green('__url'), filepath, url);

          if (!url) {
            url = '""';
          } else {
            let file = this.options.file;
            file = gutil.replaceExtension(file, '.css');
            url = resolveAssets(url, assets, file, filepath, assetsResolver);
          }

          done(new sass.types.String('url('+ url +')'));
        }
      }
    }),
    through2(function(file, enc, callback) {
      file.assets = Object.keys(assets[file.path] || []);
      callback(null, file);
    })
  );
};

module.exports = streams;
