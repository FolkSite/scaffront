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

function isUrlShouldBeIgnored (url) {
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
 * @param {function} [assetsUrlRebaser]
 * @returns {string}
 */
var rebaseAssetsUrl = function rebaseAssetsUrl (url, assetsStorage, entryFilepath, filepath, assetsUrlRebaser) {
  let rebasedUrl = url;

  if (!isUrlShouldBeIgnored(url)) {
    let resolvedUrl = __.nodeResolve(url, path.dirname(filepath), true);

    if (!__.nodeResolve.lastError) {
      resolvedUrl = path.relative(process.cwd(), resolvedUrl);

      assetsStorage[entryFilepath] = assetsStorage[entryFilepath] || {};
      assetsStorage[entryFilepath][resolvedUrl] = resolvedUrl;

      if (_.isFunction(assetsUrlRebaser)) {
        rebasedUrl = assetsUrlRebaser(resolvedUrl, {
          entryFile: path.relative(process.cwd(), entryFilepath),
          sourceFile: path.relative(process.cwd(), filepath)
        });
        rebasedUrl = (rebasedUrl) ? rebasedUrl : resolvedUrl;

        assetsStorage[entryFilepath][resolvedUrl] = rebasedUrl;
      }
    }
  }

  return rebasedUrl;
};

var streams = {};

streams.compile = function htmlCompile (options) {
  options = (_.isPlainObject(options)) ? options : {};

  if (typeof options.resolveAsset != 'function') {
    throw new Error('[scaffront][htmlCompile] `resolveAsset` must be a function.');
  }

  if (typeof options.rebaseAssetUrl != 'function') {
    throw new Error('[scaffront][htmlCompile] `rebaseAssetUrl` must be a function.');
  }



  var assetsUrlRebaser = (_.isFunction(options.assetsUrlRebaser)) ? options.assetsUrlRebaser : __.noop;
  var assets = {};

  return combiner(
    through(function(file, enc, callback) {
      var locate = function(file) {
        var search, matches;
        search = new RegExp('<[^>]+?(src|href|content)\\s*=\\s*([\"\'])(.+?)\\2', 'gm');
        matches = file.contents.toString().match(search);

        matches = matches
          .map(function (matched) {
            return new RegExp('(src|href|content)\\s*=\\s*([\"\'])(.+?)\\2', 'gm').exec(matched)[3] || null;
          })
          .filter((matched) => !!matched);

        return matches || [];
      };

      var replace = function(file, matches, handle, pathling) {
        var search = new RegExp(handle + '\\/{2}([^\'\"]+)','g');
        var destiny = path.resolve(pathling);
        var contents = file.contents.toString();
        var asset, relative;

        matches.forEach(function(match) {
          asset = path.parse(path.join(destiny, search.exec(match)[1]));
          relative = path.relative(file.dirname, destiny);
          relative = path.join(relative, asset.base);
          contents = contents.replace(match, '\"' + relative + '\"');
          search.lastIndex = 0;
        });

        file.contents = Buffer(contents);
      };

      if (file.isNull()) {
        callback();
        return;
      } else if (file.isStream()) {
        callback(new $.gutil.PluginError('qweqweqweqweqweqwe', 'Streaming not supported'));
        return;
      }

      var pathsObject = {};
      pathsObject[config.tasks.root] = '/';

      file.dirname = path.dirname(file.path);
      var matches = locate(file);
      console.log('matches', matches);
      matches.forEach(function (matched) {
        // блин. пути со слешами!!
        var resolved = __.nodeResolve(__.preparePath(matched, {startSlash: false}), file.dirname, true);

        console.log('resolved', !!__.nodeResolve.lastError, resolved);

        if (!__.nodeResolve.lastError) {

        }
      });
      //__.nodeResolve(module, basedir)

      //return replace(file, matches, handle, pathsObject[handle]);

      //delete file.dirname;
      this.push(file);
      callback();
    }),
    through(function(file, enc, callback) {
      file.assets = assets[gutil.replaceExtension(file.path, file.scssExt)] || {};
      callback(null, file);
    })
  );
};

streams.copyAssets = function (options) {
  options = (_.isPlainObject(options)) ? options : {};

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
