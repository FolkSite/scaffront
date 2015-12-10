var _           = require('lodash'),
    __          = require('../helpers'),
    path        = require('path'),
    extend      = require('extend'),
    fs          = require('fs'),
    browserSync = require('browser-sync'),
    gulpUtil    = require('gulp-util');


var config = {};

config.devServerName = 'develop';

config.servers = {
  develop: {
    options: {
      open: false,
      startPath: '/pages/',
      port: 666,
      server: {
        index: "index.html",
        directory: true,
        baseDir: path.join(global.Builder.dest)
      }
    }
  }
};


var utils = {};


var instances = {};

/**
 * @param {string} instanceName
 * @returns {*}
 */
utils.runServer = function (instanceName) {
  if (!instanceName || typeof config.servers[instanceName] == 'undefined') { return null; }

  var options = (_.isPlainObject(config.servers[instanceName].options)) ? config.servers[instanceName].options : {};

  var bs;
  try {
    bs = browserSync.get(instanceName);
  } catch (e) {
    bs = browserSync.create(instanceName);

    instances[instanceName] = {
      inited: false,
      pending: false,
      instance: bs
    };

    bs.emitter.on('init', (function (instanceName) {
      return function () {
        instances[instanceName].inited = true;
        instances[instanceName].pending = false;

        gulpUtil.log(gulpUtil.colors.cyan('Develop'), 'server is started');
      }
    })(instanceName));
  }

  if (bs.paused) {
    bs.resume();
  } else
  if (!bs.active && !instances[instanceName].pending) {

    instances[instanceName].pending = true;
    bs.init(options);
  }

  return bs;
};

/**
 *
 * @param {string} instanceName
 * @param {Stream} [stream]
 * @param {{}} [options]
 * @returns {*}
 */
utils.reloadServer = function (instanceName, stream, options) {
  if (!instanceName) { return; }

  var server = utils.runServer(instanceName);

  if (!server) { return; }

  options = (_.isPlainObject(options)) ? options : {};

  if (typeof stream != 'undefined' && gulpUtil.isStream(stream)) {
    stream.pipe(server.stream(options));
  } else {
    server.reload(options);
  }

  return server;
};


module.exports.utils  = utils;
module.exports.config = config;