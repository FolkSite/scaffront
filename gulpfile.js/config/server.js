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
    },
    callback: function (err, bs) {
      if (err) { throw new Error(err); }

      gulpUtil.log(gulpUtil.colors.cyan('Develop'), 'server is started');
    }
  }
};


var utils = {};



/**
 * @param {string} instanceName
 * @returns {*}
 */
utils.runServer = function (instanceName) {
  if (!instanceName || typeof config.servers[instanceName] == 'undefined') { return null; }

  var options = (_.isPlainObject(config.servers[instanceName].options)) ? config.servers[instanceName].options : {};
  var cb = (_.isFunction(config.servers[instanceName].callback)) ? config.servers[instanceName].callback : __.noop;

  var bs;
  try {
    bs = browserSync.get(instanceName);
    console.log('get bs', typeof bs);
  } catch (e) {
    bs = browserSync.create(instanceName);
    console.log('create bs', typeof bs);
  }

  if (bs.paused) {
    bs.resume();
  } else
  if (!bs.active) {
    bs.init(options, cb);
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