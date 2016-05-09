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
const through  = require('through2').obj;
const cheerio  = require('cheerio');

var streams = {};

streams.htmlCompile = function htmlCompile (options) {
  options = (_.isPlainObject(options)) ? options : {};

  var resolver      = __.resolverFactory(options.resolver || null);
  var assetResolver = __.assetResolverFactory(options.assetResolver || null);

  var assets = {};

  return combiner(
    through(function(file, enc, callback) {
      if (file.isNull()) {
        callback();
        return;
      } else if (file.isStream()) {
        callback(new $.gutil.PluginError('htmlCompile', 'Streaming not supported'));
        return;
      }

      var assets = {};
      var jQ = cheerio.load(file.contents);
      jQ('link').each(function (index, node) {
        var $node = jQ(node);
        var href = $node.attr('href');
        var newSrc = assetResolver(href, file.path, file.path);

        if (newSrc.url && newSrc.url != href) {
          assets[href] = newSrc;
        }
      });
      jQ('script, img').each(function (index, node) {
        var $node = jQ(node);
        var src = $node.attr('src');
        var newSrc = assetResolver(src, file.path, file.path);

        if (newSrc.url && newSrc.url != src) {
          assets[src] = newSrc;
        }
      });

      var content = file.contents.toString();
      file.assets = {};
      Object.keys(assets).forEach(function (url) {
        var asset = assets[url];

        content = content.replace(new RegExp(`<([a-z]+ .*?)(["|'])${url}\\2(.*?)>`, 'igm'), `$1$2${asset.url}$2$3`);
        content = content.replace(new RegExp(`<([a-z]+ .*?)(["|'])${url}\\2(.*?)>`, 'igm'), `$1$2${asset.url}$2$3`);

        if (asset.src && asset.dest) {
          file.assets[asset.src] = asset.dest;
        }
      });

      file.contents = Buffer.from(content);

      callback(null, file);
    }),
    through(function(file, enc, callback) {
      //file.assets = assets[gutil.replaceExtension(file.path, file.scssExt)] || {};

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
