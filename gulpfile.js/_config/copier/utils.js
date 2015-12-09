var _            = require('lodash'),
    __           = require('../../helpers'),
    del          = require('del'),
    gulp         = require('gulp'),
    gulpUtil     = require('gulp-util'),
    gulpPlumber  = require('gulp-plumber'),
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

  return del(config.cleanups)
    .then(function () {
      cb();
    })
    .catch(cb)
  ;
};


module.exports = utils;