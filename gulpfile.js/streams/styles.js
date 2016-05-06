'use strict';

const $              = require('gulp-load-plugins')();
const _              = require('lodash');
const __             = require('../helpers');
const sass           = require('node-sass');
const path           = require('path');
const gulp           = require('gulp');
const isUrl          = require('is-url');
const gutil          = require('gulp-util');
const config         = require('../../scaffront.config.js');
const extend         = require('extend');
const postcss        = require('postcss');
const resolve        = require('resolve');
const combiner       = require('stream-combiner2').obj;
const through        = require('through2').obj;
const applySourceMap = require('vinyl-sourcemaps-apply');

function isUrlShouldBeIgnored (url) {
  return url[0] === "/" ||
    url[0] === "#" ||
    url.indexOf("data:") === 0 ||
    isUrl(url) ||
    /^[a-z]+:\/\//.test(url)
}

///**
// * @param {string} url
// * @param {{}} assetsStorage Объект
// * @param {string} entryFilepath Точка входа. Для неё сохраняются ассеты из всех импортируемых файлов
// * @param {string} [filepath] Ипортируемый файл, у которого надо зарезолвить урлы
// * @param {function} [getTargetAsset]
// * @returns {string}
// */
var getTargetAssets = function getTargetAssets (assetsStorage, url, entryFilepath, baseFilepath, options) {
  var assetFilepath = options.resolver(url, path.dirname(baseFilepath), path.dirname(entryFilepath));
  var assetTarget   = options.getAssetTarget(url, assetFilepath, baseFilepath, entryFilepath);

  if (!assetTarget.url || !assetTarget.path) {
    throw new Error('[scaffront] `getTargetAsset` must return a simple object with `url` and `path` properties');
  }

  assetsStorage[assetFilepath] = assetTarget.path;

  return assetTarget.url;

  //let rebasedUrl = url;
  //
  //if (!isUrlShouldBeIgnored(url)) {
  //  let resolvedUrl = __.nodeResolve(url, path.dirname(filepath), true);
  //
  //  if (!__.nodeResolve.lastError) {
  //    resolvedUrl = path.relative(process.cwd(), resolvedUrl);
  //
  //    assetsStorage[entryFilepath] = assetsStorage[entryFilepath] || {};
  //    assetsStorage[entryFilepath][resolvedUrl] = resolvedUrl;
  //
  //    if (_.isFunction(getTargetAsset)) {
  //      rebasedUrl = getTargetAsset(resolvedUrl, {
  //        entryFile: path.relative(process.cwd(), entryFilepath),
  //        sourceFile: path.relative(process.cwd(), filepath)
  //      });
  //      rebasedUrl = (rebasedUrl) ? rebasedUrl : resolvedUrl;
  //
  //      assetsStorage[entryFilepath][resolvedUrl] = rebasedUrl;
  //    }
  //  }
  //}
  //
  //return rebasedUrl;
};

///**
// * @param {{}} assetsStorage Объект
// * @param {string} entryFilepath Точка входа. Для неё сохраняются ассеты из всех импортируемых файлов
// * @param {string} [filepath] Импортируемый файл, у которого надо зарезолвить урлы
// * @param {function} [assetsRebaser]
// * @returns {string}
// */
var getTargetAssetsPlugin = function getTargetAssetsPlugin (assetsStorage, entryFilepath, filepath, options) {

  return require('postcss-url')({
    url: function (url) {
      return getTargetAssets(assetsStorage, url, entryFilepath, filepath, options);

      ////assetUrl, assetFilepath, baseFilepath, entryFilepath
      //var assetFilepath = options.resolver(url, path.dirname(filepath), path.dirname(entryFilepath));
      //var assetTarget = options.getTargetAsset(url, assetFilepath, filepath, entryFilepath);
      //
      //if (!assetTarget.url || !assetTarget.path) {
      //  throw new Error('[scaffront] `getTargetAsset` must return an object with `url` and `path` properties');
      //}
      //
      //assetsStorage[assetFilepath] = assetTarget.path;
      //
      //return assetTarget.url;
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

var streams = {};

streams.cssCompile = function cssCompile (options) {
  options = (_.isPlainObject(options)) ? options : {};

  if (typeof options.resolver != 'function') {
    throw new Error('[scaffront][cssCompile] `resolver` must be a function.');
  }

  if (typeof options.getAssetTarget != 'function') {
    throw new Error('[scaffront][cssCompile] `getAssetTarget` must be a function.');
  }

  var assets = {};

  return combiner(
    // пропускаем каждую точку входа через свой поток-трансформер
    through(function(file, enc, callback) {
      if (file.isNull()) {
        return cb(null, file);
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

      //var entryFilepath = path.join(file.base, file.name);
      var entryFilepath = file.path;
      //console.log($.util.colors.blue('entryFilepath'), entryFilepath);

      postcss([
        // сперва сохраним все ассеты для точки входа
        getTargetAssetsPlugin(assets, entryFilepath, entryFilepath, options),
        // импортируем вложенные css-ки
        require('postcss-import')({
          // резолвим пути по стандарному для node.js алгоритму
          resolve: function (module, basedir, importOptions) {
            return options.resolver(module, basedir, path.dirname(entryFilepath));
          },
          // каждый импортированный файл тоже надо пропустить через postcss
          transform: function(css, filepath, _options) {
            return postcss([
              // теперь сохраним все ассеты из импортируемых файлов
              getTargetAssetsPlugin(assets, entryFilepath, filepath, options)
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
          file.assets = {};

          // Apply source map to the chain
          if (file.sourceMap) {
            map = result.map.toJSON();
            map.file = file.relative;
            map.sources = [].map.call(map.sources, function (source) {
              return path.join(path.dirname(file.relative), source);
            });
            applySourceMap(file, map);
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

streams.scssCompile = function scssCompile (options) {

  if (typeof options.resolver != 'function') {
    throw new Error('[scaffront][scssCompile] `resolver` must be a function.');
  }

  if (typeof options.getAssetTarget != 'function') {
    throw new Error('[scaffront][scssCompile] `getAssetTarget` must be a function.');
  }

  var assetsUrlRebaser = (_.isFunction(options.assetsUrlRebaser)) ? options.assetsUrlRebaser : __.noop;
  var assets = {};

  return combiner(
    through(function(file, enc, callback) {
      var __filepath = `$__filepath: unquote("${file.path}");`;
      var contents = file.contents.toString().replace(/(@import\b.+?;)/gm, `$1\n${__filepath}`);

      contents = `
        ${__filepath}
        @function url($url: null) {
          @return __url($__filepath, $url);
        }
        ${contents}
      `;

      file.contents = Buffer.from(contents);
      file.scssExt = path.extname(file.path);
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
         * @param {string} filepath
         * @param {string} contents
         * @returns {string}
         */
        transformContent: function (filepath, contents) {
          var __filepath = `$__filepath: unquote("${filepath}");`;
          contents = contents.replace(/(@import\b.+?;)/gm, '$1\n'+ __filepath);

          return `${__filepath}\n${contents}`;
        }
      },
      functions: {
        '__url($filepath, $url)': function(filepath, url, done) {
          url      = url.getValue();
          filepath = filepath.getValue();

          if (!url) {
            url = '';
          } else {
            url = rebaseAssetsUrl(url, assets, this.options.file, filepath, options.getAssetTarget);
          }

          done(new sass.types.String('url("'+ url +'")'));
        }
      }
    }),
    through(function(file, enc, callback) {
      file.assets = assets[gutil.replaceExtension(file.path, file.scssExt)] || {};
      callback(null, file);
    })
  );
};

streams.copyAssets = function (options) {
  options = (_.isPlainObject(options)) ? options : {};

  console.log('copyAssets!');

  return combiner(
    through(function(file, enc, callback) {
      var assetsStreamsCount = 0;
      var assetsStreamsCountEnded = 0;

      var assetStreamCallback = function () {
        assetsStreamsCountEnded++;
        if (assetsStreamsCountEnded != assetsStreamsCount) { return; }

        callback(null, file);
      };

      Object.keys(file.assets).forEach(function (sourceFile) {
        var destFile = path.join(config.tasks.dest, file.assets[sourceFile]);
        var destPath = path.dirname(destFile);
        destFile = path.basename(destFile);

        gulp
          .src(sourceFile)
          .pipe(through((function (newBasename) {
            return function(file, enc, callback) {
              file.basename = newBasename;
              callback(null, file);
            };
          })(destFile)))
          .pipe($.newer(destPath))
          .pipe(gulp.dest(destPath))
          .on('end', assetStreamCallback)
        ;

        assetsStreamsCount++;
      });
    })
  );
};

streams.dist = function (options) {
  options = (_.isPlainObject(options)) ? options : {};


};

module.exports = streams;
