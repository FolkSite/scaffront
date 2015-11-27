var _                  = require('lodash'),
    __                 = require('../../helpers'),
    extend             = require('extend'),
    path               = require('path'),
    gulp               = require('gulp'),
    gulpUtil           = require('gulp-util'),
    gulpChanged        = require('gulp-changed'),
    gulpRunSequence    = require('run-sequence').use(gulp),
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

var makeBundleStream = function (bundle, source) {

  return bundle.bundler.bundle(bundle.build.callback)
    .on('error', bundle.build.errorHandler)
    .pipe(vinylSourceStream(bundle.build.outfile))
    .pipe(gulpIf(getObject.get(bundle, 'build.options.standalone'), gulpDerequire()))
    // если нужно вернуть только vinyl-source, то не буферизируем.
    // по умолчанию считаем, что всегда нужно вернуть буфер
    .pipe(gulpIf(!source, vinylBuffer()))
  ;
};






var StreamHandler = clazz({
  constructor: function (bundle) {
    this.bundle = bundle;
    this.stream = this._getBundleSourceStream();
  },

  fromBundle: function (bundle) {
    this.stream = this._getBundleSourceStream();
  },

  _getBundleSourceStream: function () {
    var bundle = this.bundle;

    return bundle.bundler.bundle(bundle.build.callback)
      .on('error', bundle.build.errorHandler)
      .pipe(vinylSourceStream(bundle.build.outfile))
    ;
  },

  getStreamBuffer: function (stream) {
    if (gulpUtil.isBuffer(stream)) {
      return stream;
    }

    return stream.pipe(vinylBuffer());
  },

  uglify: function (stream) {
    var bundle = this.bundle;


    return stream;
  },

  sourcemapsInit: function (stream) {
    var bundle = this.bundle;

    if (_.isArray(getObject.get(bundle, 'dest.Sourcemaps.init'))) {
      stream = this.getStreamBuffer(stream)
        .pipe(gulpSourcemaps.init.apply(gulpSourcemaps.init, bundle.dest.Sourcemaps.init))
      ;
    }

    return stream;
  },

  sourcemapsWrite: function (stream) {
    var bundle = this.bundle;

    if (_.isArray(getObject.get(bundle, 'dest.Sourcemaps.write'))) {
      stream = this.getStreamBuffer(stream)
        .pipe(gulpSourcemaps.init.apply(gulpSourcemaps.write, bundle.dest.Sourcemaps.write))
      ;
    }

    return stream;
  },


  sendToDest: function (stream) {
    var bundle = this.bundle;

    stream.pipe(gulp.dest(bundle.build.des));

    return stream;
  },
});

var buildBundle = function (bundle) {
  var stream = makeBundleSourceStream(bundle)
    // если нужен standalone-модуль, то применим gulpDerequire
    .pipe(gulpIf(getObject.get(bundle, 'build.options.standalone'), gulpDerequire()))
    // отправим собранный бандл в конечную папку
    .pipe(gulp.dest(bundle.build.des))
  ;

  // если его нужно сжать
  if (_.isArray(getObject.get(bundle, 'dest.Uglify'))) {
    stream
      // превращаем в буфер, иначе gulpUglify не заведётся
      .pipe(vinylBuffer())
      // если нужны sourcemap'ы, то инициализируем их их
      .pipe(gulpIf(
        _.isArray(getObject.get(bundle, 'dest.Sourcemaps.init')),
        gulpSourcemaps.init.apply(gulpSourcemaps.init, bundle.dest.Sourcemaps.init)
      ))
      // кукожим
      .pipe(gulpUglify.apply(gulpUglify, bundle.dest.Uglify))
      // переименовываем, если нужно (суффиксы/префикы)
      .pipe(gulpIf(
        _.isArray(getObject.get(bundle, 'dest.UglifyRename')),
        gulpRename.apply(gulpRename, bundle.dest.UglifyRename)
      ))
      // если нужна шапка - добавляем
      .pipe(gulpIf(
        _.isArray(getObject.get(bundle, 'dest.GulpHeader')),
        gulpHeader.apply(gulpHeader, bundle.dest.GulpHeader)
      ))
      // а теперь записываем sourcemap'ы
      .pipe(gulpIf(
        _.isArray(getObject.get(bundle, 'dest.Sourcemaps.write')),
        gulpSourcemaps.init.apply(gulpSourcemaps.write, bundle.dest.Sourcemaps.write)
      ))

      // и всё туда же
      .pipe(gulp.dest(bundle.build.des))
    ;
  }
  //.pipe(gulpIf(true, ))

  return stream;
};

gulp.task('scripts:build', function (cb) {
  var bundles = getBundles(true);
  var queue = length = bundles.length;

  gulpUtil.log('Build bundles. Total:', gulpUtil.colors.cyan(length));

  return gulpMerge(_.map(bundles, function (bundle) {
    return makeBundleStream(bundle)
      .pipe(gulpRename({suffix: '.dest'}))
      .pipe(gulp.dest(bundle.build.dest))
    ;
  }))
    .pipe(gulp.dest('dist/js'));

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
  ;

  return stream;


  bundles.forEach(function (bundle) {
    makeBundleSourceStream(bundle)
      .pipe(gulp.dest(bundle.build.dest))
      .pipe(gulpDerequire())

      .pipe(vinylBuffer())
      .pipe(gulpSourcemaps.init({loadMaps: true}))
      .pipe(gulpUglify())
      .pipe(gulpRename({suffix: '.min'}))
      .pipe(gulpSourcemaps.write('./'))
      .pipe(gulp.dest(bundle.build.dest))
      .on('end', function () {
        queue -= 1;

        gulpUtil.log('Bundle done:', gulpUtil.colors.magenta(path.resolve(process.cwd(), bundle.build.destFullPath)));

        if (!queue) { cb(); }
      })
    ;


  });
});

gulp.task('scripts:build:cleanup', function (cb) {
  var bundles = getBundles(true);
  var queue = length = bundles.length;

  gulpUtil.log('Remove bundles. Total:', gulpUtil.colors.cyan(length));

  bundles.forEach(function (bundle) {

    makeBundleVinylBuffer(bundle)
      .pipe(gulpTap(function (file) {
        del(bundle.build.destFullPath).then(function () {
          queue -= 1;

          gulpUtil.log('Bundle removed:', gulpUtil.colors.magenta(path.resolve(process.cwd(), bundle.build.destFullPath)));

          if (!queue) { cb(); }
        });
      }))
    ;

  });
});


gulp.task('scripts:minify', function (cb) {
  var bundles = getBundles(true);
  var queue = length = bundles.length;

  gulpUtil.log('Minifying bundles. Total:', gulpUtil.colors.cyan(length));

  bundles.forEach(function (bundle) {

    makeBundleVinylBuffer(bundle)
      .pipe(gulpTap(function (file) {
        del(bundle.build.destFullPath).then(function () {
          queue -= 1;

          gulpUtil.log('Bundle removed:', gulpUtil.colors.magenta(path.resolve(process.cwd(), bundle.build.destFullPath)));

          if (!queue) { cb(); }
        });
      }))
    ;

  });
});

gulp.task('scripts:minify:cleanup', function (cb) {
  var bundles = getBundles(true);
  var queue = length = bundles.length;

  gulpUtil.log('Remove bundles. Total:', gulpUtil.colors.cyan(length));

  bundles.forEach(function (bundle) {

    makeBundleVinylBuffer(bundle)
      .pipe(gulpTap(function (file) {
        del(bundle.build.destFullPath).then(function () {
          queue -= 1;

          gulpUtil.log('Bundle removed:', gulpUtil.colors.magenta(path.resolve(process.cwd(), bundle.build.destFullPath)));

          if (!queue) { cb(); }
        });
      }))
    ;

  });
});


gulp.task('scripts:polyfilly', function (cb) {
  var bundles = getBundles();
});

gulp.task('scripts:polyfilly:cleanup', function (cb) {
  var bundles = getBundles();
});


gulp.task('scripts:dist', function (cb) {
  var bundles = getBundles();
});

gulp.task('scripts:dist:cleanup', function (cb) {
  var bundles = getBundles();
});


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

