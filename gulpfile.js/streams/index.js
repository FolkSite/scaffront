const $              = require('gulp-load-plugins')();
const _              = require('lodash');
const __             = require('../helpers');
const path           = require('path');
const gulp           = require('gulp');
const combiner       = require('stream-combiner2').obj;
const through        = require('through2').obj;

var streams = {
  styles:  require('./styles'),
  pages:   require('./pages'),
  scripts: require('./scripts')
  //images:  require('./images'),
};

streams.copyAssets = function (options) {
  options = (_.isPlainObject(options)) ? options : {};

  return combiner(
    through(function(file, enc, callback) {
      file.assets = (_.isPlainObject(file.assets)) ? file.assets : {};

      var assetsSrc = Object.keys(file.assets);
      var assetsCount = assetsSrc.length;

      if (!assetsCount) {
        callback(null, file);
        return;
      }

      var assetsStreamsCountEnded = 0;

      var assetStreamCallback = function () {
        assetsStreamsCountEnded++;
        if (assetsStreamsCountEnded != assetsCount) { return; }

        callback(null, file);
      };

      assetsSrc.forEach(function (sourceFile) {
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
      });
    })
  );
};

module.exports = streams;
