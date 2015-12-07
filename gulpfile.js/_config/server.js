var _           = require('lodash'),
    __          = require('../helpers'),
    path        = require('path'),
    extend      = require('extend'),
    fs          = require('fs'),
    browserSync = require('browser-sync'),
    gulpUtil    = require('gulp-util');

module.exports = (function () {
  var config = {};

  config.devServerName = 'develop';

  config.BrowserSync = {
    develop: {
      options: {
        open: false,
        startPath: '/html/',
        port: 666,
        server: {
          index: "index.html",
          directory: true,
          baseDir: 'dist'
        }
      },
      callback: function (err, bs) {
        if (err) { throw new Error(err); }

        gulpUtil.log(gulpUtil.colors.cyan('Develop'), 'server is started');
      }
    },
  };

  /**
   * @param {String} instanceName
   */
  config.getBrowserSync = function (instanceName) {
    if (!instanceName || typeof config.BrowserSync[instanceName] == 'undefined') { return null; }

    var options = (_.isPlainObject(config.BrowserSync[instanceName].options)) ? config.BrowserSync[instanceName].options : {};
    var cb = (_.isFunction(config.BrowserSync[instanceName].callback)) ? config.BrowserSync[instanceName].callback : __.noop;

    var bs;
    try {
      bs = browserSync.get(instanceName);
    } catch (e) {
      bs = browserSync.create(instanceName);
    }

    if (bs.paused) {
      bs.resume();
    } else
    if (!bs.active) {
      bs.init(options, cb);
    }

    return bs;
  };

  return config;
})();