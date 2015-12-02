// http://stackoverflow.com/questions/29222745/how-do-i-exclude-the-requirereact-from-my-browserified-bundle

var _                 = require('lodash'),
    __                = require('../../helpers'),
    extend            = require('extend'),
    path              = require('path'),
    gulp              = require('gulp'),
    gulpUtil          = require('gulp-util'),
    gulpTap           = require('gulp-tap'),
    mergeStreams      = require('event-stream').merge,
    del               = require('del'),
    gulpIf            = require('gulp-if'),
    getObject         = require('getobject'),
    gulpDerequire     = require('gulp-derequire'),
    browserify        = require('browserify'),
    watchify          = require('watchify'),
    vinylSourceStream = require('vinyl-source-stream'),
    vinylBuffer       = require('vinyl-buffer')
  ;

var Config         = require('../../_config').scripts,
    BowerConfig    = require('../../_config').bower,
    ServerConfig   = require('../../_config').server,
    ScriptsClasses = require('./classes');


var defaults = {
  src: __.preparePath({trailingSlash: true}, Config.src),
  dest: __.preparePath({trailingSlash: true}, Config.dest)
};

var getBundles = (function () {
  var bundles = null;

  return function (makeBundlers) {
    if (!bundles) {
      bundles = new ScriptsClasses.BundlesMaker(Config.bundles, defaults);
    }

    makeBundlers = (typeof makeBundlers != 'undefined') ? !!makeBundlers : true;

    return bundles.get(makeBundlers);
  };
})();

/**
 * @param {BundleConfig} bundle
 * @param {boolean} [returnBuffer=true] Return returnBuffer
 * @returns {Stream}
 */
var makeBundleStream = function (bundle, returnBuffer) {
  returnBuffer = (typeof returnBuffer != 'undefined') ? !!returnBuffer : true;

  bundle.stream = bundle.bundler.bundle(bundle.callback)
    .on('error', bundle.errorHandler)
    .pipe(vinylSourceStream(bundle.outfile))
    .pipe(gulpIf(getObject.get(bundle, 'options.standalone'), gulpDerequire()))
    .pipe(gulpIf(returnBuffer, vinylBuffer()))
  ;

  return bundle.stream;
};

/**
 * @param {BundleConfig} bundle
 * @returns {Stream}
 */
var buildBundle = function (bundle) {
  bundle.stream = makeBundleStream(bundle);

  return bundle.stream
    .pipe(gulp.dest(bundle.dest))
    .pipe(gulpTap(function () {
      var bundlePath = path.normalize(path.resolve(process.cwd(), bundle.destFullPath));
      gulpUtil.log('Bundle built:', gulpUtil.colors.cyan(bundlePath));
    }))
  ;
};

/**
 * @param {BundleConfig[]} [bundles]
 * @returns {Stream}
 */
var buildBundles = function (bundles) {
  bundles = (typeof bundles != 'undefined' && _.isArray(bundles)) ? bundles : getBundles();

  return mergeStreams(_.map(bundles, function (bundle) {
    return buildBundle(bundle);
  }));
};

/**
 * Build bundles
 */
gulp.task('scripts:build', function (cb) {
  return buildBundles();
});

/**
 * Cleanup build-scripts
 */
gulp.task('scripts:build:cleanup', function (cb) {
  var bundles = getBundles();

  return mergeStreams(_.map(bundles, function (bundle) {
    bundle.stream = makeBundleStream(bundle);

    return bundle.stream
      .pipe(gulpTap(function () {
        del.sync(bundle.destFullPath);
        var bundlePath = path.normalize(path.resolve(process.cwd(), bundle.destFullPath));
        gulpUtil.log('Bundle removed:', gulpUtil.colors.cyan(bundlePath));
      }))
    ;
  }));
});

/**
 * Build dist-scripts
 */
gulp.task('scripts:dist', ['scripts:build'], function (cb) {
  if (!_.isFunction(Config.bundlesDist)) {
    cb();
    return;
  }

  var bundles = getBundles();

  _.each(bundles, function (bundle) {
    bundle.stream = makeBundleStream(bundle);
  });

  __.runSyncAsync([bundles], Config.bundlesDist, cb);
});

/**
 * Cleanup dist-scripts
 */
gulp.task('scripts:dist:cleanup', function (cb) {
  if (!_.isFunction(Config.bundlesDistCleanup)) {
    cb();
    return;
  }

  var bundles = getBundles();

  _.each(bundles, function (bundle) {
    bundle.stream = makeBundleStream(bundle);
  });

  __.runSyncAsync([bundles], Config.bundlesDistCleanup, cb);
});

/**
 * Watcher
 */
gulp.task('scripts:watch', function (cb) {
  var server = null;
  if (_.isFunction(ServerConfig.getBrowserSync)) {
    server = ServerConfig.getBrowserSync('develop');
  }

  var bundles = getBundles();

  _.each(bundles, function (bundle) {
    bundle.watchify = watchify(bundle.bundler);
    bundle.watchify.on('update', (function (bundle) {
      return function () {
        gulpUtil.log('Rebundling...');
        var stream = buildBundle(bundle);

        // reload server
        if (stream && server) {
          stream.pipe(server.stream({
            once: true,
            match: '**/*.js'
          }));
        }
      };
    })(bundle));

    bundle.watchify.on('time', function (time) {
      gulpUtil.log('Rebundled in:', gulpUtil.colors.cyan(time + 'ms'));
    });

    buildBundle(bundle);
  });
});
