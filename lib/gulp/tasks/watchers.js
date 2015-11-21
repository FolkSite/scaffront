var Helpers = require('../../helpers/functions.js');
var config = require('../config.js');

var _ = require('lodash');
var Gulp = require('gulp');
var BrowserSync = require('browser-sync');

var Changed = require('gulp-changed');
var RunSequence = require('run-sequence').use(Gulp);
var Plumber = require('gulp-plumber');
var Del = require('del');
var Gutil = require('gulp-util');
var Foreach = require('gulp-foreach');


Gulp.task('watch', function() {
  global.isWatching = true;

  var bs = Helpers.getBrowserSyncInstance(config.BrowserSync.instanceName, true, config.BrowserSync.config, function (err, bs) {
    if (err) {
      throw new Error(err);
      return;
    }


  });



});


Gulp.task('watch:cleanup', function() {
  global.isWatching = false;
});
