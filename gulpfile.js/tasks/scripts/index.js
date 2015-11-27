var _                  = require('lodash'),
    __                 = require('../../helpers'),
    extend             = require('extend'),
    path               = require('path'),
    gulp               = require('gulp'),
    gulpUtil           = require('gulp-util'),
    gulpChanged        = require('gulp-changed'),
    runSequence    = require('run-sequence').use(gulp),
    gulpPlumber        = require('gulp-plumber'),
    gulpRename         = require('gulp-rename'),
    gulpTap            = require('gulp-tap'),
    gulpLazypipe       = require('lazypipe'),

    gulpUglify         = require('gulp-uglify'),
    gulpMerge          = require('event-stream').merge,
    gulpConcat         = require('gulp-concat'),
    gulpAutoPolyfiller = require('gulp-autopolyfiller'),
    gulpSourcemaps     = require('gulp-sourcemaps'),
    gulpOrder          = require('gulp-order'),
    del                = require('del'),
    gulpify            = require('gulpify'),
    gulpIf             = require('gulp-if'),
    gulpDerequire      = require('gulp-derequire'),
    gulpHeader         = require('gulp-header'),
    browserify         = require('browserify'),
    watchify           = require('watchify'),
    vinylSourceStream  = require('vinyl-source-stream'),
    vinylBuffer        = require('vinyl-buffer'),
    getObject          = require('getobject'),
    jsFace             = require("jsface"),
    clazz              = jsFace.Class;

var Config            = require('../../_config').scripts,
    BowerConfig       = require('../../_config').bower,
    ScriptsClasses    = require('./classes');



var defaults = {
  src: Config.src,
  dest: Config.dest
};

var getBundles = (function () {
  var bundles = null;

  return function (makeBundlers) {
    if (!bundles) {
      bundles = new ScriptsClasses.BundlesMaker(Config.bundles, defaults);
    }

    return bundles.get(!!makeBundlers);
  };
})();

/**
 * @param {BundleConfig} bundle
 * @param {boolean} [buffer=true] Return buffer
 * @returns {Stream}
 */
var makeBundleStream = function (bundle, buffer) {
  buffer = (typeof buffer != 'undefined') ? !!buffer : true;

  bundle.stream = bundle.bundler.bundle(bundle.callback)
    .on('error', bundle.errorHandler)
    .pipe(vinylSourceStream(bundle.outfile))
    .pipe(gulpIf(getObject.get(bundle, 'options.standalone'), gulpDerequire()))
    .pipe(gulpIf(buffer, vinylBuffer()))
  ;

  return bundle.stream;
};


gulp.task('scripts:build', function (cb) {
  var bundles = getBundles(true);

  return gulpMerge(_.map(bundles, function (bundle) {
    bundle.stream = makeBundleStream(bundle);

    return bundle.stream
      .pipe(gulp.dest(bundle.dest))
      .pipe(gulpTap(function () {
        var bundlePath = path.normalize(path.resolve(process.cwd(), bundle.destFullPath));
        gulpUtil.log('Bundle built:', gulpUtil.colors.cyan(bundlePath));
      }))
    ;
  }))
  ;
});

gulp.task('scripts:build:cleanup', function (cb) {
  var bundles = getBundles(true);

  return gulpMerge(_.map(bundles, function (bundle) {
    bundle.stream = makeBundleStream(bundle);

    return bundle.stream
      .pipe(gulpTap(function () {
        del.sync(bundle.destFullPath);
        var bundlePath = path.normalize(path.resolve(process.cwd(), bundle.destFullPath));
        gulpUtil.log('Bundle removed:', gulpUtil.colors.cyan(bundlePath));
      }))
    ;
  }))
  ;
});


gulp.task('scripts:dist', ['scripts:build'], function (cb) {
  if (!_.isFunction(Config.bundlesDist)) {
    cb();
    return;
  }

  var bundles = getBundles(true);

  _.each(bundles, function (bundle) {
    bundle.stream = makeBundleStream(bundle);
  });

  __.runSyncAsync([bundles], Config.bundlesDist, cb);
});

//gulp.task('scripts:dist:cleanup', function (cb) {
//  if (!_.isFunction(Config.bundlesDistCleanup)) { cb(); }
//
//  var bundles = _.map(getBundles(true), function (bundle) {
//    bundle.stream = makeBundleStream(bundle);
//
//    return bundle;
//  });
//
//  __.runSyncAsync([bundles], Config.bundlesDistCleanup, function () {
//    console.log('cb arguments', arguments);
//
//    cb();
//  });
//});


gulp.task('scripts:watch', function (cb) {
  var bundles = getBundles();
});


return;

/**
 * @param {{}} [config]
 * @returns {Stream}
 */
var Minify = function (config) {
  config = (_.isPlainObject(config)) ? config : {};

  return gulpLazypipe()
    .pipe(gulpUglify(config))
    .pipe(gulpRename({suffix: '.min'}))
};

/**
 * @param {{}} [config]
 * @returns {Stream}
 */
var Polyfilly = function (config) {
  config = (_.isPlainObject(config)) ? config : {};

  return gulpLazypipe()
    .pipe(gulpTap(function (file) {
      var filePath          = file.path,
          extname           = path.extname(filePath),
          filename          = path.basename(filePath),
          basename          = path.basename(filePath, extname),
          path              = filePath.replace(new RegExp(basename + extname + '$'), ''),
          polyfillsFileName = basename + '.polyfills' + extname,

          FileStream        = gulp.src(file.path),
          polyfillsStream   = FileStream.pipe(gulpAutoPolyfiller(polyfillsFileName, config));

      return gulpMerge(FileStream, polyfillsStream)
        .pipe(gulpOrder([
          polyfillsFileName,
          filename
        ]))
        .pipe(gulpConcat(filename))
        .pipe(gulp.dest(path));
    }));
};



function rebundle (bundler, callback) {
  return bundler.bundle(callback)
    .on('error', Helpers.plumberErrorHandler.errorHandler)
    .pipe(vinylSourceStream('js.js'))
    .pipe(gulp.dest('dist/js/'))
    .pipe(vinylBuffer())
    .pipe(gulpUglify())
    .pipe(gulpRename({suffix: '.min'}))
    .pipe(gulp.dest('dist/js/'));
}


var browserSync = require('browser-sync');

gulp.task('browser-sync', function () {
  var bundlerW = watchify(bundler);
  bundlerW.on('update', function () {
    Gutil.log('Rebundling...');
  });
  bundlerW.on('time', function (time) {
    Gutil.log('Rebundled in:', Gutil.colors.cyan(time + 'ms'));
  });

  bundlerW.on('update', function () {
    rebundle(bundler).pipe(browserSync.stream({once: true}));
  });

  browserSync({
    port: 666,
    open: false,
    startPath: '/html/',
    server: {
      index: "index.html",
      directory: true,
      baseDir: 'dist'
    }
  })
});



gulp.task('scripts:bundle', function () {

  return rebundle(bundler);
});

gulp.task('scripts:test', ['scripts:bundle', 'browser-sync']);



gulp.task('js:polyfilly', function(cb) {
  var src = Helpers.getGlobPaths(Config.src, '.js', false)
    .concat(Helpers.getGlobPaths(Config.src, '.min.js', false, true))
    .concat(Helpers.getGlobPaths(Config.src, '.polyfilled.js', false, true));

  return gulp.src(src)
    .pipe(gulpPlumber(Helpers.plumberErrorHandler))
    .pipe(gulpTap(function (file) {
      var filePath          = file.path,
          extname           = path.extname(filePath),
          filename          = path.basename(filePath),
          basename          = path.basename(filePath, extname),
          path              = filePath.replace(new RegExp(basename + extname + '$'), ''),
          polyfillsFileName = basename + '.polyfilled' + extname,

          FileStream        = gulp.src(file.path),
          polyfillsStream   = FileStream.pipe(gulpAutoPolyfiller(polyfillsFileName, Config.AutoPolyfiller));

      return gulpMerge(FileStream, polyfillsStream)
        .pipe(gulpOrder([
          polyfillsFileName,
          filename
        ]))
        .pipe(gulpConcat(filename))
        .pipe(gulp.dest(path));
    }));
});





return;

/**
 * @param {string|{}} file
 * @param {string} [standalone]
 * @returns {*}
 */

