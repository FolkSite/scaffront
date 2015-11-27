var _                  = require('lodash'),
    __                 = require('../helpers'),
    Path               = require('path'),
    Extend             = require('extend'),
    del                = require('del'),
    gulp               = require('gulp'),
    gulpUtil           = require('gulp-util'),
    gulpIf             = require('gulp-if'),
    gulpHeader         = require('gulp-header'),
    runSequence        = require('run-sequence').use(gulp),
    gulpRename         = require('gulp-rename'),
    gulpTap            = require('gulp-tap'),
    gulpLazypipe       = require('lazypipe'),
    gulpUglify         = require('gulp-uglify'),
    gulpMerge          = require('event-stream').merge,
    gulpConcat         = require('gulp-concat'),
    gulpAutoPolyfiller = require('gulp-autopolyfiller'),
    gulpSourcemaps     = require('gulp-sourcemaps'),
    gulpOrder          = require('gulp-order'),
    getObject          = require('getobject'),
    FS                 = require('fs');

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
        fullPaths: !global.isProduction,
        debug: !global.isProduction
      },
      setup: function setup (bundler) {
        // можно подключать напрямую в script (классический принцип scope'а подключаемых файлов). ignore просто выпиливает этот модуль из бандла
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
      //outfile: 'libs.js',
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

  config.bundlesDist = function (bundles, cb) {
    var bundlesMergeStream = gulpMerge(_.map(bundles, function (bundle) {
      return bundle.stream;
    }));

    var streamPolyfill = bundlesMergeStream
      .pipe(gulpConcat('all.js'))
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

    //return
    gulpMerge(bundlesMergeStream, streamPolyfill)
      .pipe(gulpSourcemaps.init({loadMaps: true}))
      .pipe(gulpUglify())
      .pipe(gulpRename({suffix: '.min'}))
      .pipe(gulpSourcemaps.write('./'))
      .pipe(gulp.dest(config.dest))
      .on('end', function () {
        cb();
      })
    ;

//    .pipe(gulpIf(
//      _.isArray(getObject.get(bundle, 'dest.GulpHeader')),
//      gulpHeader.apply(gulpHeader, bundle.dest.GulpHeader)
//    ))
  };

  config.bundlesDistCleanup = function (bundles, cb) {

  };

  return config;
})();