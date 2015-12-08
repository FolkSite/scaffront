var _            = require('lodash'),
    __           = require('../../helpers'),
    gulp         = require('gulp'),
    gulpUtil     = require('gulp-util'),
    mergeStreams = require('event-stream').merge
;

var utils = {};

/**
 * @param {Copier|Copier[]} config
 * @param {Function} [cb]
 * @returns {Stream|null}
 */
utils.copy = function (config, cb) {
  cb = (_.isFunction(cb)) ? cb : function () {};

  var copiers = __.getCopier(config);
  if (!copiers.length) {
    cb();
    return null;
  }

  return mergeStreams(_.map(config, function (item) {
    var stream = gulp.src(item.from);

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
 * @param {Copier} config
 * @param {Function} [cb]
 * @returns {Stream|null}
 */
utils.cleanup = function (config, cb) {
  cb = (_.isFunction(cb)) ? cb : function () {};

  if (!__.isCopier(config)) {
    cb();
    return null;
  }

  config = __.getCopier(config);

  return del(config.cleanups);
};




module.exports = utils;