var _           = require('lodash'),
    Path        = require('path'),
    Extend      = require('extend'),
    FS          = require('fs'),
    BrowserSync = require('browser-sync'),
    Helpers     = require('../helpers');

module.exports = (function () {
  var config = {};

  config.BrowserSyncConfig = {
    instanceName: 'server',
    options: {
      config: {
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

      }
    }
  };

  /**
   * @param {String} instanceName
   * @param {{}} [config={}]
   * @param {boolean} [init=true]
   * @param {Function} [cb=function(){}]
   */
  config.getBrowserSyncInstance = function (instanceName, config, init, cb) {
    config = (typeof config != 'undefined' && _.isPlainObject(config)) ? config : {};
    init = (typeof init != 'undefined') ? !!init : true;
    cb = (_.isFunction(cb)) ? cb : Helpers.noop;

    if (!instanceName) { return null; }

    var bs;
    try {
      bs = BrowserSync.get(instanceName);
    } catch (e) {
      bs = BrowserSync.create(instanceName);
    }

    if (init) {
      if (bs.paused) {
        bs.resume();
      } else
      if (!bs.active) {
        bs.init(config, cb);
      }
    }

    return bs;
  };

  return config;
})();