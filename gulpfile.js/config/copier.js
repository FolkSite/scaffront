var _            = require('lodash'),
    __           = require('../helpers'),
    path         = require('path'),
    gulp         = require('gulp'),
    gulpUtil     = require('gulp-util'),
    gulpPlumber  = require('gulp-plumber'),
    Promise      = require('bluebird'),
    mergeStreams = require('event-stream').merge
;

var config = {};

/**
 * @property {Copier|Copier[]}
 */
config.copier = [{
  from: __.getGlobPaths(path.join(global.Builder.src, 'images/content'), ['png', 'jpg', 'jpeg', 'gif', 'svg'], true),
  to: path.join(global.Builder.dest, 'images'),
  cleanups: __.getGlobPaths(path.join(global.Builder.dest, 'images'), ['png', 'jpg', 'jpeg', 'gif', 'svg'], true)
},
  {
    from: __.getGlobPaths(path.join(global.Builder.src, 'images/inline'), ['png', 'jpg', 'jpeg', 'gif', 'svg'], true),
    to: path.join(global.Builder.dest, 'i'),
    cleanups: __.getGlobPaths(path.join(global.Builder.dest, 'i'), ['png', 'jpg', 'jpeg', 'gif', 'svg'], true)
  }
  //{
    //from: '',
    //to: '',
    //transform: function (stream, cb) {
    //  return stream;
    //},
    //cleanups: _.flatten(cleanupGlobs)
  //}
];


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


module.exports.utils  = utils;
module.exports.config = config;
