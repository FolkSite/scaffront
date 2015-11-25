// http://habrahabr.ru/post/224825/
// https://makeomatic.ru/blog/2014/12/06/Tips_and_Tricks/
// http://frontender.info/gulp-browserify-starter-faq/


var Helpers           = require('../helpers/index.js'),
    Config            = require('../config.js').scripts,

    _                 = require('lodash'),
    Path              = require('path'),
    Gulp              = require('gulp'),
    Changed           = require('gulp-changed'),
    RunSequence       = require('run-sequence').use(Gulp),
    Plumber           = require('gulp-plumber'),
    Uglify            = require('gulp-uglify'),
    Del               = require('del'),
    Extend            = require('extend'),
    Rename            = require('gulp-rename'),
    Tap               = require('gulp-tap'),
    Gutil             = require('gulp-util'),

    Merge             = require('event-stream').merge,
    Concat            = require('gulp-concat'),
    AutoPolyfiller    = require('gulp-autopolyfiller'),
    Order             = require('gulp-order'),
    Lazypipe          = require('lazypipe'),
    Browserify        = require('browserify'),
    Watchify          = require('watchify'),
    isStream          = require('isstream'),
    VinylSourceStream = require('vinyl-source-stream'),
    VinylBuffer       = require('vinyl-buffer'),

    bowerConfig       = require('../config.js').bower;


var defaults = {
  copy: {
    src: 'app/scripts/vendor',
    dest: 'dist/js/vendor'
  },
  build: {
    src: 'app/scripts',
    dest: 'dist/js'
  },
};

Config = Extend(true, defaults, Config);

Config.dest = Helpers.preparePath({trailingSlash: true}, Config.dest);

if (!_.isPlainObject(Config.bundleDefaults)) {
  throw new Error('Invalid defaults settings for bundles!');
}


//var resolve = require('resolve-bower');
//var res = resolve.sync('jquery', { basedir: Path.join(__dirname, 'app/scripts/bower_components') });



/**
 * @param {String|BundleConfig} bundle
 * @returns {BundleConfig}
 */
var _validateBundle = function _validateBundle (bundle) {
  var tmp;

  if (bundle.validated) { return bundle; }

  // бандл может быть строкой или строковым массивом.
  // надо преобразовать к общему виду (как Config.defaults)
  if (_.isString(bundle)) {
    tmp = bundle;
    bundle = { entry: tmp };
  }

  // если вместо конфига бандла пришла какая-то хрень, то нахер
  if (!_.isPlainObject(bundle)) {
    throw new Error([
      'Invalid bundle.',
      Helpers.stringify(bundle),
      ''
    ].join('\n'));
  }

  bundle = Extend(true, Config.bundleDefaults, bundle);

  // валидация опций бандлера
  if (!_.isPlainObject(bundle.options)) {
    bundle.options = Config.bundleDefaults.options;
  } else {
    bundle.options = Extend(true, Config.bundleDefaults.options, bundle.options);
  }

  // сделаем массивом входной файл, если ещё не.
  if (!_.isArray(bundle.entry)) {
    bundle.entry = [bundle.entry || null];
  }
  // сделаем массивом входной файл из опций, если ещё не.
  if (!_.isArray(bundle.options.entries)) {
    bundle.options.entries = [bundle.options.entries || null];
  }

  // перенесём входные файлы из опций в entry, для консистентности
  bundle.entry = _.compact(_.union(bundle.entry, bundle.options.entries));
  delete bundle.options.entries;

  // теперь сформируем нормальные пути для каждого файла
  bundle.entry = _.map(bundle.entry, function (entry, index) {
    var _entry, result = null;

    if (entry) {
      _entry = Helpers.parsePath(entry);

      if (_entry.isOnlyFile) {
        result = Path.join(Config.src, _entry.base);
      } else if (_entry.isPathToFile) {
        result = Path.format(_entry);
      }

      result = Path.normalize(result);
    }

    return result;
  });

  bundle.entry = _.uniq(_.compact(bundle.entry));

  // если, после всех преобразований, нет ни одной входной точки, то нахер это всё
  if (!bundle.entry.length) {
    throw new Error([
      'Bundle\'s entry file is required.',
      Helpers.stringify(bundle),
      ''
    ].join('\n'));
  }

  // если выходной файл не установлен и всего одна входная точка,
  // заберём из неё название файла
  if (!bundle.outfile && bundle.entry.length == 1) {
    bundle.outfile = Path.parse(bundle.entry[0]).base;
  }

  // если outfile установлен - нужно отделить мух от котлет (имя файла от пути)
  if (bundle.outfile) {
    var _outfile = Helpers.parsePath(entry);

    if (_outfile.isOnlyPath) {
      bundle.outfile = null;
      bundle.dest    = null;
    } else {
      if (_outfile.isOnlyFile) {
        bundle.outfile = _outfile.base;
        bundle.dest    = Config.dest;
      } else if (_outfile.isPathToFile) {
        bundle.outfile = _outfile.base;
        bundle.dest    = _outfile.dir;
      }

      bundle.dest = Helpers.preparePath({trailingSlash: true}, bundle.dest);
    }
  }

  // если и выходного файла нет, то тем более нахер это всё
  if (!bundle.outfile) {
    throw new Error([
      'Bundle\'s output filename is required.',
      Helpers.stringify(bundle)
    ].join('\n'));
  }

  // функция настройки бандлера
  if (!_.isFunction(bundle.setup)) {
    bundle.setup = Config.bundleDefaults.setup;
  }

  // коллбек для бандлера
  if (!_.isFunction(bundle.callback)) {
    bundle.callback = Config.bundleDefaults.callback;
  }

  if (typeof bundle.AutoPolyfiller != 'undefined') {
    if (!bundle.AutoPolyfiller) {
      bundle.AutoPolyfiller = Config.bundleDefaults.AutoPolyfiller;
    }
    if (!_.isPlainObject(bundle.AutoPolyfiller)) {
      bundle.AutoPolyfiller = Config.bundleDefaults.AutoPolyfiller;
    }
  } else {
    bundle.AutoPolyfiller = false;
  }

  if (typeof bundle.AutoPolyfiller != 'undefined' && !_.isPlainObject(bundle.AutoPolyfiller)) {
    bundle.AutoPolyfiller = Config.bundleDefaults.AutoPolyfiller;
  } else {
    bundle.AutoPolyfiller = false;
  }

  if (typeof bundle.Uglify != 'undefined' && !_.isPlainObject(bundle.Uglify)) {
    bundle.Uglify = Config.bundleDefaults.Uglify;
  } else {
    bundle.Uglify = false;
  }

  bundle.validated = true;
  bundle.bundler = null;

  return bundle;
};

/**
 * @param {BundleConfig[]} bundles
 * @returns {[]}
 */
var _validateBundles = function _validateBundles (bundles) {
  bundles = (!_.isArray(bundles)) ? [bundles] : bundles;

  return _.map(bundles, function (bundle) {
    return _validateBundle(bundle);
  });
};

/**
 * @param {BundleConfig[]} bundles
 * @returns {[]}
 */
var _makeBundlers = function _makeBundlers (bundles) {
  return _.map(_validateBundles(bundles), function (bundle) {
    if (bundle.bundler) { return bundle; }

    bundle.bundler = Browserify(bundle.entry, Extend(true, Watchify.args, bundle.options));
    bundle.setup(bundle.bundler);

    return bundle;
  });
};

/**
 * @returns {Function}
 */
var getBundlers = (function () {
  var bundlers = null;

  /**
   * @returns {BundleConfig[]}
   */
  return function getBundlers () {
    if (bundlers) { return bundlers; }

    return bundlers = _makeBundlers(Config.bundles);
  };
})();

_.each(getBundlers(), function (_bundler, index) {
  var bundler = _bundler.bundler;
  var callback = _bundler.callback;


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