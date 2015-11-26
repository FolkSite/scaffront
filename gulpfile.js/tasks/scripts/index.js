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
    Browserify        = require('browserify'),
    Watchify          = require('watchify'),
    VinylSourceStream = require('vinyl-source-stream'),
    VinylBuffer       = require('vinyl-buffer');

var Config            = require('../../_config/index').scripts,
    BowerConfig       = require('../../_config/index').bower,
    ScriptsClasses    = require('classes');




var defaults = {
  scr: Config.src,
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


Gulp.task('scripts:build', function (cb) {

});
Gulp.task('scripts:build:cleanup', function (cb) {

});

Gulp.task('scripts:minify', function (cb) {

});
Gulp.task('scripts:minify:cleanup', function (cb) {

});

Gulp.task('scripts:polyfilly', function (cb) {

});
Gulp.task('scripts:polyfilly:cleanup', function (cb) {

});

Gulp.task('scripts:dist', function (cb) {

});
Gulp.task('scripts:dist:cleanup', function (cb) {

});

Gulp.task('scripts:watch', function (cb) {

});




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

/*
var getPreBundle = function (file, standalone) {
  var args = _.toArray(arguments);
  var options = {};

  if (_.isPlainObject(args[0])) {
    file = '';
    standalone = false;
    options = args[0];
  }

  var defaults = {
    // это для sourcemaps
    cache: {}, packageCache: {}, fullPaths: !global.isProduction,
    // путь до end-point (app.js)
    entries: file,
    // если пишем модуль, то через этот параметр
    // browserify обернет всё в UMD-обертку
    // и при подключении объект будет доступен как bundle.global
    standalone: standalone,
    //extensions: Config.extensions || '.js',
    debug: !global.isProduction
  };

  options = Extend(true, defaults, options);

  return browserify(options);
};

var buildStreams = Lazypipe();


gulp.task('scripts', function(cb) {

  // считаем кол-во бандлов
  var queue = Config.bundles.length;

  // поскольку бандлов может быть несколько, оборачиваем сборщик в функцию,
  // которая в качестве аргумента принимает bundle-объект с параметрами
  // позже запустим её в цикл
  var buildThis = function(bundle) {

    var preBundle = getPreBundle(path);
    //isStream

    // отдаем preBundle browserify
    //var preBundle = browserify({
    //  // это для sourcemaps
    //  cache: {}, packageCache: {}, fullPaths: devBuild,
    //  // путь до end-point (app.js)
    //  entries: preBundle.src,
    //  // если пишем модуль, то через этот параметр
    //  // browserify обернет всё в UMD-обертку
    //  // и при подключении объект будет доступен как preBundle.global
    //  standalone: preBundle.global,
    //  // дополнительные расширения
    //  extensions: Config.extensions,
    //  // пишем sourcemaps?
    //  debug: devBuild
    //});

    // сборка
    var build = function() {

      return (
        // browserify-сборка
        preBundle.bundle().pipe(buildStreams())
          // превращаем browserify-сборку в vinyl
          .pipe(VinylSourceStream())
          // эта штука нужна, чтобы нормально работал `require` собранной библиотеки
          .pipe(derequire())
          // если dev-окружение, то сохрани неминифицированную версию в `public/` (зачем - не помню))
          .pipe(gulpif(devBuild, gulp.dest(preBundle.destPublicDir)))
          // если сохраняем в папку `dist` - сохраняем
          .pipe(gulpif(preBundle.saveToDist, gulp.dest(preBundle.destDistDir)))
          // это для нормальной работы sourcemaps при минификации
          .pipe(gulpif(preBundle.compress, buffer()))
          // если dev-окружение и нужна минификация — инициализируем sourcemaps
          .pipe(gulpif(preBundle.compress && devBuild, sourcemaps.init({loadMaps: true})))
          // минифицируем
          .pipe(gulpif(preBundle.compress, uglify()))
          // к минифицированной версии добавляем суффикс `.min`
          .pipe(gulpif(preBundle.compress, rename({suffix: '.min'})))
          // если собираем для production - добавляем баннер с названием и версией релиза
          .pipe(gulpif(!devBuild, header(Config.banner)))
          // пишем sourcemaps
          .pipe(gulpif(preBundle.compress && devBuild, sourcemaps.write('./')))
          // сохраняем минифицированную версию в `/dist`
          .pipe(gulpif(preBundle.saveToDist, gulp.dest(preBundle.destDistDir)))
          // и в `public`
          .pipe(gulp.dest(preBundle.destPublicDir))
          // в конце исполняем callback handleQueue (определен ниже)
          .on('end', handleQueue)
      );

    };

    // если нужны watchers
    if (global.isWatching) {
      // оборачиваем browserify-сборку в watchify
      preBundle = watchify(preBundle);
      // при обновлении файлов из сборки - пересобираем бандл
      preBundle.on('update', build);
    }

    // в конце сборки бандла
    var handleQueue = function () {
      Helpers.notify(destFile);
      // если есть очередь
      if (queue) {
        // уменьшаем на 1
        queue--;
        // если бандлов больше нет, то сообщаем, что таск завершен
        if (queue === 0) cb();
      }
    };

    return build();
  };

  // запускаем массив бандлов в цикл
  Config.bundles.forEach(buildThis);

});







var sourceFile = './js/main.js',
    destFolder = './js/',
    destFile = 'findem.js';

gulp.task('browserify', function() {
  return browserify(sourceFile)
    .bundle()
    //.bundle({debug:true}) // sourcemaps
    .pipe(source(destFile))
    .pipe(gulp.dest(destFolder));
});

gulp.task('watch', function() {
  var bundler = watchify(sourceFile);

  var rebundle = function() {
    return bundler.bundle()
      //.bundle({debug:true}) // sourcemaps
      .pipe(source(destFile))
      .pipe(gulp.dest(destFolder));
  };

  bundler.on('update', rebundle);

  return rebundle();
});


//*/