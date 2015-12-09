var _            = require('lodash'),
    __           = require('../../helpers'),
    del          = require('del'),
    gulp         = require('gulp'),
    gulpUtil     = require('gulp-util'),
    gulpPlumber  = require('gulp-plumber'),
    mergeStreams = require('event-stream').merge,
    Promise      = require('bluebird')
;

var utils = {};

/**
 * @param {Copier|Copier[]} config
 * @returns {Stream|null}
 */
utils.copy = function (config) {
  if (!config) {
    return Promise.resolve();
  }
  config = (!_.isArray(config)) ? [config] : config;

  if (!config.length) {
    return Promise.resolve();
  }

  var copiers = _.map(config, function (item) {
    return __.getCopier(item);
  });

  return mergeStreams(_.map(copiers, function (item) {
    var stream = gulp.src(item.from);

    stream.pipe(gulpPlumber(__.plumberErrorHandler));

    if (_.isFunction(item.transform)) {
      var tmp = item.transform(stream);
      stream = (gulpUtil.isStream(tmp)) ? tmp : stream;
    }

    _.each(item.to, function (to) {
      stream = stream.pipe(gulp.dest(to));
    });

    return stream;
  }));
};

/**
 * @param {Copier|Copier[]} config
 * @returns {Promise|Stream}
 */
utils.cleanup = function (config) {
  if (!config) {
    return Promise.resolve();
  }
  config = (!_.isArray(config)) ? [config] : config;

  if (!config.length) {
    return Promise.resolve();
  }

  config = _.map(config, function (item) {
    return __.getCopier(item);
  });

  return Promise.all(_.map(config, function (item) {
    if (!item.cleanups) {
      return Promise.resolve();
    }

    return del(item.cleanups);
  }));
};


module.exports = utils;