const $              = require('gulp-load-plugins')();
const _              = require('lodash');
const __             = require('../helpers');
const path           = require('path');
const gulp           = require('gulp');
const combiner       = require('stream-combiner2').obj;
const through        = require('through2').obj;

var streams = {
  styles: require('./styles'),
  pages: require('./pages'),
  scripts: require('./scripts')
};

streams.copyAssets = function (options) {
  options = (_.isPlainObject(options)) ? options : {};

  return combiner(
    through(function(file, enc, callback) {
      if (!file.assets) {
        callback(null, file);
        return;
      }

      var assetsStreamsCount = 0;
      var assetsStreamsCountEnded = 0;

      var assetStreamCallback = function () {
        assetsStreamsCountEnded++;
        if (assetsStreamsCountEnded != assetsStreamsCount) { return; }

        callback(null, file);
      };

      Object.keys(file.assets).forEach(function (sourceFile) {
        var destPath = file.assets[sourceFile];
        var destFile = path.basename(destPath);
        destPath = path.dirname(destPath);

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

module.exports = streams;