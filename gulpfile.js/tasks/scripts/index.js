var _                 = require('lodash'),
    __                = require('../../helpers'),
    Extend            = require('extend'),
    Path              = require('path'),
    Gulp              = require('gulp'),
    GulpUtil          = require('gulp-util'),
    Changed           = require('gulp-changed'),
    RunSequence       = require('run-sequence').use(Gulp),
    Plumber           = require('gulp-plumber'),
    Rename            = require('gulp-rename'),
    Tap               = require('gulp-tap'),
    Lazypipe          = require('lazypipe'),
    isStream          = require('isstream'),

    Uglify            = require('gulp-uglify'),
    Merge             = require('event-stream').merge,
    Concat            = require('gulp-concat'),
    AutoPolyfiller    = require('gulp-autopolyfiller'),
    Order             = require('gulp-order'),
    Del               = require('del'),
    Gulpify           = require('gulpify'),
    Browserify        = require('browserify'),
    Watchify          = require('watchify'),
    VinylSourceStream = require('vinyl-source-stream'),
    VinylBuffer       = require('vinyl-buffer');

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
 */
var makeBundleVinylBuffer = function (bundle) {

  return bundle.bundler.bundle(bundle.build.callback)
    .on('error', bundle.build.errorHandler)
    .pipe(VinylSourceStream(bundle.build.outfile))
    .pipe(VinylBuffer())
  ;
};

var buildBundle = function (bundle) {
  makeBundleVinylBuffer(bundle);
};

Gulp.task('scripts:build', function (cb) {
  var bundles = getBundles(true);
  var queue = length = bundles.length;

  GulpUtil.log('Build bundles. Total:', GulpUtil.colors.cyan(length));

  bundles.forEach(function (bundle) {

    makeBundleVinylBuffer(bundle)
      .pipe(Gulp.dest(bundle.build.dest))
      .on('end', function () {
        queue -= 1;

        GulpUtil.log('Bundle done:', GulpUtil.colors.magenta(Path.resolve(process.cwd(), bundle.build.destFullPath)));

        if (!queue) { cb(); }
      })
    ;

  });
});

Gulp.task('scripts:build:cleanup', function (cb) {
  var bundles = getBundles(true);
  var queue = length = bundles.length;

  GulpUtil.log('Remove bundles. Total:', GulpUtil.colors.cyan(length));

  bundles.forEach(function (bundle) {

    makeBundleVinylBuffer(bundle)
      .pipe(Tap(function (file) {
        Del(bundle.build.destFullPath).then(function () {
          queue -= 1;

          GulpUtil.log('Bundle removed:', GulpUtil.colors.magenta(Path.resolve(process.cwd(), bundle.build.destFullPath)));

          if (!queue) { cb(); }
        });
      }))
    ;

  });
});


Gulp.task('scripts:minify', function (cb) {
  var bundles = getBundles(true);
  var queue = length = bundles.length;

  GulpUtil.log('Minifying bundles. Total:', GulpUtil.colors.cyan(length));

  bundles.forEach(function (bundle) {

    makeBundleVinylBuffer(bundle)
      .pipe(Tap(function (file) {
        Del(bundle.build.destFullPath).then(function () {
          queue -= 1;

          GulpUtil.log('Bundle removed:', GulpUtil.colors.magenta(Path.resolve(process.cwd(), bundle.build.destFullPath)));

          if (!queue) { cb(); }
        });
      }))
    ;

  });
});

Gulp.task('scripts:minify:cleanup', function (cb) {
  var bundles = getBundles(true);
  var queue = length = bundles.length;

  GulpUtil.log('Remove bundles. Total:', GulpUtil.colors.cyan(length));

  bundles.forEach(function (bundle) {

    makeBundleVinylBuffer(bundle)
      .pipe(Tap(function (file) {
        Del(bundle.build.destFullPath).then(function () {
          queue -= 1;

          GulpUtil.log('Bundle removed:', GulpUtil.colors.magenta(Path.resolve(process.cwd(), bundle.build.destFullPath)));

          if (!queue) { cb(); }
        });
      }))
    ;

  });
});


Gulp.task('scripts:polyfilly', function (cb) {
  var bundles = getBundles();
});

Gulp.task('scripts:polyfilly:cleanup', function (cb) {
  var bundles = getBundles();
});


Gulp.task('scripts:dist', function (cb) {
  var bundles = getBundles();
});

Gulp.task('scripts:dist:cleanup', function (cb) {
  var bundles = getBundles();
});


Gulp.task('scripts:watch', function (cb) {
  var bundles = getBundles();
});


return;

/**
 * @param {{}} [config]
 * @returns {Stream}
 */
var Minify = function (config) {
  config = (_.isPlainObject(config)) ? config : {};

  return Lazypipe()
    .pipe(Uglify(config))
    .pipe(Rename({suffix: '.min'}))
};

/**
 * @param {{}} [config]
 * @returns {Stream}
 */
var Polyfilly = function (config) {
  config = (_.isPlainObject(config)) ? config : {};

  return Lazypipe()
    .pipe(Tap(function (file) {
      var filePath          = file.path,
          extname           = Path.extname(filePath),
          filename          = Path.basename(filePath),
          basename          = Path.basename(filePath, extname),
          path              = filePath.replace(new RegExp(basename + extname + '$'), ''),
          polyfillsFileName = basename + '.polyfills' + extname,

          FileStream        = Gulp.src(file.path),
          polyfillsStream   = FileStream.pipe(AutoPolyfiller(polyfillsFileName, config));

      return Merge(FileStream, polyfillsStream)
        .pipe(Order([
          polyfillsFileName,
          filename
        ]))
        .pipe(Concat(filename))
        .pipe(Gulp.dest(path));
    }));
};



function rebundle (bundler, callback) {
  return bundler.bundle(callback)
    .on('error', Helpers.plumberErrorHandler.errorHandler)
    .pipe(VinylSourceStream('js.js'))
    .pipe(Gulp.dest('dist/js/'))
    .pipe(VinylBuffer())
    .pipe(Uglify())
    .pipe(Rename({suffix: '.min'}))
    .pipe(Gulp.dest('dist/js/'));
}


var browserSync = require('browser-sync');

Gulp.task('browser-sync', function () {
  var bundlerW = Watchify(bundler);
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



Gulp.task('scripts:bundle', function () {

  return rebundle(bundler);
});

Gulp.task('scripts:test', ['scripts:bundle', 'browser-sync']);



Gulp.task('js:polyfilly', function(cb) {
  var src = Helpers.getGlobPaths(Config.src, '.js', false)
    .concat(Helpers.getGlobPaths(Config.src, '.min.js', false, true))
    .concat(Helpers.getGlobPaths(Config.src, '.polyfilled.js', false, true));

  return Gulp.src(src)
    .pipe(Plumber(Helpers.plumberErrorHandler))
    .pipe(Tap(function (file) {
      var filePath          = file.path,
          extname           = Path.extname(filePath),
          filename          = Path.basename(filePath),
          basename          = Path.basename(filePath, extname),
          path              = filePath.replace(new RegExp(basename + extname + '$'), ''),
          polyfillsFileName = basename + '.polyfilled' + extname,

          FileStream        = Gulp.src(file.path),
          polyfillsStream   = FileStream.pipe(AutoPolyfiller(polyfillsFileName, Config.AutoPolyfiller));

      return Merge(FileStream, polyfillsStream)
        .pipe(Order([
          polyfillsFileName,
          filename
        ]))
        .pipe(Concat(filename))
        .pipe(Gulp.dest(path));
    }));
});





return;

/**
 * @param {string|{}} file
 * @param {string} [standalone]
 * @returns {*}
 */

