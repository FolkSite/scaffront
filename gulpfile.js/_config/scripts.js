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
    //FS                 = require('fs'),
    //bowerDirectory     = require('bower-directory'),
    bowerResolve       = require('bower-resolve'),
    nodeResolve        = require('resolve'),
    swigify            = require('swigify');

module.exports = (function () {

  var config = {
    src: 'app/scripts',
    dest: 'dist/js',
  };


  var nodeLibs = [
    'swig',
    'lodash'
  ];
  var bowerLibs = [

  ];

  var defaultsBrowserifyOptions = {
    debug: !global.isProduction,
    transform: ['deglobalify', 'deamdify'],
  };

  /**
   * @property {BundleConfig|BundleConfig[]} config.bundles
   */
  config.bundles = [
    {
      entry: 'js.js',
      options: extend(defaultsBrowserifyOptions, {

      }),
      setup: function setup (bundler) {
        getBowerPackageIds(bowerLibs).forEach(function (lib) {
          bundler.external(lib);
        });

        getNPMPackageIds(nodeLibs).forEach(function (id) {
          bundler.external(id);
        });

        //bundler.transform(swigify({
        //  //compress: true,
        //  //tagnames: ['import', 'include', 'extends'],
        //  //newVarControls: ['<$', '$>'],
        //  //newTagControls: ['<$', '$>'],
        //  //oldTagControls: ['{%', '%}']
        //}));

      },
      // callback will be passed to .bundle(callback)
      callback: function callback (err, buf) {}
    },
    {
      entry: 'libs.js',
      options: extend(defaultsBrowserifyOptions, {

      }),
      setup: function setup (bundler) {
        getBowerPackageIds(bowerLibs).forEach(function (id) {
          var resolvedPath = bowerResolve.fastReadSync(id);
          console.log('resolvedPath', resolvedPath);
          bundler.require(resolvedPath, {
            expose: id
          });
        });

        getNPMPackageIds(nodeLibs).forEach(function (id) {
          bundler.require(nodeResolve.sync(id), {
            expose: id
          });
        });

      },
      callback: function callback (err, buf) {}
    },
    {
      entry: 'templates.js',
      options: extend(defaultsBrowserifyOptions, {

      }),
      setup: function setup (bundler) {
        getBowerPackageIds(bowerLibs).forEach(function (lib) {
          bundler.external(lib);
        });

        getNPMPackageIds(nodeLibs).forEach(function (id) {
          bundler.external(id);
        });
      },
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



  function getBowerPackageIds (libs) {
    libs = (_.isArray(libs)) ? libs : [];

    var bowerManifest = {};
    try {
      bowerManifest = require('../../bower.json');
    } catch (e) {
      // does not have a bower.json manifest
    }

    return _.intersection(_.keys(bowerManifest.dependencies) || [], libs);
  }


  function getNPMPackageIds (libs) {
    libs = (_.isArray(libs)) ? libs : [];

    var packageManifest = {};
    try {
      packageManifest = require('../../package.json');
    } catch (e) {
      // does not have a package.json manifest
    }

    return _.intersection(_.keys(packageManifest.dependencies) || [], libs);
  }

  return config;

})();