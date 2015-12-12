// http://stackoverflow.com/questions/29222745/how-do-i-exclude-the-requirereact-from-my-browserified-bundle
// https://toster.ru/q/176877

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

var _config        = require('../../config'),
    Config         = _config.scripts,
    ServerConfig   = _config.server,
    CopierUtils    = _config.copier.utils,
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
  if (_.isFunction(ServerConfig.runServer)) {
    server = ServerConfig.runServer('develop');
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








//var watcherHandler = function (stream, bsConfig) {
//  if (!Server) { return; }
//
//  bsConfig = (_.isPlainObject(bsConfig)) ? bsConfig : {};
//
//  if (gulpUtil.isStream(stream)) {
//    stream.pipe(Server.stream(bsConfig));
//  } else {
//    Server.reload(bsConfig);
//  }
//};
//
//
//gulp.task('scripts:copier', function (cb) {
//  CopierUtils.copy(getObject.get(Config, 'copier'), cb);
//});
//
//gulp.task('scripts:copier:cleanup', function (cb) {
//  CopierUtils.cleanup(getObject.get(Config, 'copier'), cb);
//});
//
//
//gulp.task('scripts:builder', function () {
//  var stream = gulp.src(__.getGlobPaths(Config.src, Config.extnames || [], true))
//        .pipe(gulpPlumber(__.plumberErrorHandler))
//    ;
//
//  if (getObject.get(Config, 'transform') && _.isFunction(Config.transform)) {
//    var tmp = Config.transform(stream);
//    stream = (gulpUtil.isStream(tmp)) ? tmp : stream;
//  }
//
//  stream = stream
//    .pipe(gulp.dest(Config.dest))
//  ;
//
//  watcherHandler(stream);
//
//  return stream;
//});
//
//gulp.task('scripts:builder:cleanup', function (cb) {
//  if (!getObject.get(Config, 'cleanups') || !Config.cleanups) {
//    cb();
//    return;
//  }
//
//  del(Config.cleanups)
//    .then(function () {
//      cb();
//    })
//    .catch(cb);
//});
//
//
//gulp.task('scripts:build', function (cb) {
//  runSequence(['scripts:copier', 'scripts:builder'], cb);
//});
//
//gulp.task('scripts:build:cleanup', function (cb) {
//  runSequence(['scripts:copier:cleanup', 'scripts:builder:cleanup'], cb);
//});
//
//
//gulp.task('scripts:dist', function (cb) {
//  runSequence('scripts:build', cb);
//});
//
//gulp.task('scripts:dist:cleanup', function (cb) {
//  runSequence('scripts:dist:cleanup', cb);
//});
//
//
//gulp.task('scripts:watch', function (cb) {
//  if (_.isFunction(ServerConfig.runServer)) {
//    Server = ServerConfig.runServer(ServerConfig.devServerName);
//  }
//
//  gulp.watch(__.getGlobPaths(Config.src, Config.extnames || []), ['scripts:builder']);
//
//  var copiers = __.getCopier(getObject.get(Config, 'copier'));
//  var copyWatchers = [];
//  _.each(copiers, function (copier) {
//    copyWatchers = copyWatchers.concat(copier.from);
//  });
//  copyWatchers.length && gulp.watch(copyWatchers, ['scripts:copier']);
//});
//
