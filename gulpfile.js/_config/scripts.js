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
      build: {
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
      dist: {

      }
    },
    {
      build: {
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
      },
      dist: {

      }
    }
  ];

  config.bundlesDist = function (bundles, cb) {

    return gulpMerge(_.map(bundles, function (bundle) {

      return bundle.stream
        .pipe(gulp.dest(bundle.build.dest))
        .pipe(gulpTap(function () {
          var bundlePath = path.normalize(path.resolve(process.cwd(), bundle.build.destFullPath));
          gulpUtil.log('Bundle built:', gulpUtil.colors.cyan(bundlePath));
        }))
        ;
    }))
      ;


    //.pipe(gulpTap(function (file, transform) {
    //  console.log(file.path);
    //}))
    ////.pipe(gulpOrder([
    ////  'lib.js',
    ////  'js.js',
    ////]))
    ////.pipe(gulpConcat('qweqwe.js'))
    //.pipe(gulpSourcemaps.init({loadMaps: true}))
    //.pipe(gulpUglify())
    //.pipe(gulpRename({suffix: '.min'}))
    //.pipe(gulpSourcemaps.write('./'))
    //.pipe(gulp.dest('dist/js'))

    //// если его нужно сжать
    //if (_.isArray(getObject.get(bundle, 'dest.Uglify'))) {
    //  stream
    //    // превращаем в буфер, иначе gulpUglify не заведётся
    //    .pipe(vinylBuffer())
    //    // если нужны sourcemap'ы, то инициализируем их их
    //    .pipe(gulpIf(
    //      _.isArray(getObject.get(bundle, 'dest.Sourcemaps.init')),
    //      gulpSourcemaps.init.apply(gulpSourcemaps.init, bundle.dest.Sourcemaps.init)
    //    ))
    //    // кукожим
    //    .pipe(gulpUglify.apply(gulpUglify, bundle.dest.Uglify))
    //    // переименовываем, если нужно (суффиксы/префикы)
    //    .pipe(gulpIf(
    //      _.isArray(getObject.get(bundle, 'dest.UglifyRename')),
    //      gulpRename.apply(gulpRename, bundle.dest.UglifyRename)
    //    ))
    //    // если нужна шапка - добавляем
    //    .pipe(gulpIf(
    //      _.isArray(getObject.get(bundle, 'dest.GulpHeader')),
    //      gulpHeader.apply(gulpHeader, bundle.dest.GulpHeader)
    //    ))
    //    // а теперь записываем sourcemap'ы
    //    .pipe(gulpIf(
    //      _.isArray(getObject.get(bundle, 'dest.Sourcemaps.write')),
    //      gulpSourcemaps.init.apply(gulpSourcemaps.write, bundle.dest.Sourcemaps.write)
    //    ))
    //
    //    // и всё туда же
    //    .pipe(gulp.dest(bundle.build.des))
    //  ;
    //}
    //.pipe(gulpIf(true, ))

  };

  config.bundlesDistCleanup = function (bundles, cb) {

  };

  return config;
})();