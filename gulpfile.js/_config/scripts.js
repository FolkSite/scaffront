var _                  = require('lodash'),
    __                 = require('../helpers'),
    path               = require('path'),
    extend             = require('extend'),
    del                = require('del'),
    gulp               = require('gulp'),
    gulpUtil           = require('gulp-util'),
    gulpRename         = require('gulp-rename'),
    gulpTap            = require('gulp-tap'),
    gulpLazypipe       = require('lazypipe'),
    gulpUglify         = require('gulp-uglify'),
    gulpMerge          = require('event-stream').merge,
    gulpConcat         = require('gulp-concat'),
    gulpAutoPolyfiller = require('gulp-autopolyfiller'),
    gulpSourcemaps     = require('gulp-sourcemaps'),
    FS                 = require('fs'),
    swigify            = require('swigify');

module.exports = (function () {

  var config = {
    src: 'app/scripts',
    dest: 'dist/js',
  };

  /**
   * @property {BundleConfig|BundleConfig[]} config.bundles
   */
  config.bundles = [
    {
      entry: 'js.js',
      options: {
        //fullPaths: !global.isProduction,
        fullPaths: false,
        debug: !global.isProduction
      },
      setup: function setup (bundler) {
        bundler.transform(swigify({
          //compress: true,
          //tagnames: ['import', 'include', 'extends'],
          //newVarControls: ['<$', '$>'],
          //newTagControls: ['<$', '$>'],
          //oldTagControls: ['{%', '%}']
        }));
        // можно подключать напрямую в script (классический принцип scope'а подключаемых файлов). ignore просто выпиливает этот модуль из бандла
        //bundler.external('lodash');
        //bundler.ignore('libs');
        bundler.ignore('jquery');
        // должен быть доступен из require (из другого бандла)
        //bundler.external('jquery');

        //bundler.add('app/scripts/app/js.js');
      },
      // callback will be passed to .bundle(callback)
      callback: function callback (err, buf) {}
    },
    {
      entry: 'libs.js',
      setup: function setup (bundler) {
        // можно подключать напрямую в script (классический принцип scope'а подключаемых файлов). ignore просто выпиливает этот модуль из бандла
        bundler.ignore('jquery');
        // должен быть доступен из require (из другого бандла)
        //bundler.external('jquery');

        //bundler.add('app/scripts/app/js.js');
      },
      // callback will be passed to .bundle(callback)
      callback: function callback (err, buf) {}
    }
  ];

  /**
   * Камстомный таск для scripts:dist.
   * Вызов коллбека 'cb' обязателен.
   *
   * @param {BundleConfig[]} bundles
   * @param {Function} cb
   */
  config.bundlesDist = function (bundles, cb) {
    var bundlesMergeStream = gulpMerge(_.map(bundles, function (bundle) {
      return bundle.stream;
    }));

    var streamPolyfill = bundlesMergeStream
      .pipe(gulpConcat('all.js'))
      .pipe(gulpTap(function () {
        gulpUtil.log('Generating polyfills...');
      }))
      .pipe(gulpAutoPolyfiller('polyfills.js', {
        browsers: [
          'last 3 version',
          'ie 8',
          'ie 9'
        ],
        exclude: [
          'Promise'
        ]
      }))
      .pipe(gulp.dest(config.dest))
    ;

    gulpMerge(bundlesMergeStream, streamPolyfill)
      .pipe(gulpSourcemaps.init({loadMaps: true}))
      .pipe(gulpTap(function (file) {
        gulpUtil.log('Minifying', gulpUtil.colors.cyan(file.path));
      }))
      .pipe(gulpUglify())
      .pipe(gulpRename({suffix: '.min'}))
      .pipe(gulpTap(function (file) {
        gulpUtil.log('Write sourcemaps for', gulpUtil.colors.cyan(file.path));
      }))
      .pipe(gulpSourcemaps.write('./'))
      .pipe(gulp.dest(config.dest))
      .on('end', cb)
    ;
  };

  /**
   * Функция очистки за таском scripts:dist
   * Вызов коллбека 'cb' обязателен.
   *
   * @param {BundleConfig[]} bundles
   * @param {Function} cb
   */
  config.bundlesDistCleanup = function (bundles, cb) {
    gulp.src([
      path.join(config.dest, 'polyfills.js'),
      path.join(config.dest, '*.min.js'),
      path.join(config.dest, '*.js.map')
    ])
      .pipe(gulpTap(function (file) {
        del.sync(file.path);
        gulpUtil.log('Removed:', gulpUtil.colors.cyan(file.path));
      }))
      .on('end', cb)
    ;
  };



  return config;
})();