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

var streams = {};

streams.compileHtml = function htmlCompile (options) {
  options = (_.isPlainObject(options)) ? options : {};

  if (typeof options.resolver != 'function') {
    throw new Error('[scaffront][cssCompile] `resolver` must be a function.');
  }

  if (typeof options.getAssetTarget != 'function') {
    throw new Error('[scaffront][cssCompile] `getAssetTarget` must be a function.');
  }

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

      file.dirname = path.dirname(file.path);
      var matches = locate(file);
      //console.log('matches', matches);
      // todo: а когда resolver возвращает пустую строку? чего делать?
      console.log($.util.colors.blue('html file'), file.basename);
      matches.forEach(function (module) {
        console.log($.util.colors.blue('module'), module);
        var resolved = config.tasks.resolver(module, file.dirname, file.dirname);
        console.log($.util.colors.blue('resolved'), resolved);
      });


      //this.push(file);
      callback(null, file);
      return;

      matches.forEach(function (matched) {
        // блин. пути со слешами!!
        var resolved = __.nodeResolve(__.preparePath(matched, {startSlash: false}), file.dirname, true);

        console.log('resolved', !!__.nodeResolve.lastError, resolved);

        if (!__.nodeResolve.lastError) {

        }
      });

      //return replace(file, matches, handle, pathsObject[handle]);

      //delete file.dirname;
      this.push(file);
      callback();

    }),
    through(function(file, enc, callback) {
      file.assets = assets[gutil.replaceExtension(file.path, file.scssExt)] || {};

      console.log($.util.colors.blue('basename'), file.basename);
      console.log($.util.colors.blue('assets'), file.assets);

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
