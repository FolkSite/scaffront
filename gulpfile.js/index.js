'use strict';

const $         = require('gulp-load-plugins')();
const _         = require('lodash');
const __        = require('./helpers');
const del       = require('del');
const path      = require('path');
const pathUp    = require('./path-up');
const VinylPath = pathUp.VinylPath;
const gulp      = require('gulp');
const isUrl     = require('is-url');
const merge     = require('merge-stream');
const extend    = require('extend');
const postcss   = require('postcss');
const combiner  = require('stream-combiner2').obj;

var tasksConfig      = {};
var config           = require('../scaffront.config.js');
config.resolver      = config.resolver || null;
config.assetResolver = config.assetResolver || null;
const tasks          = require('./tasks');
const streams        = require('./streams');


if (config.env.isDev) {
  require('trace');
  require('clarify');
}


const runTask = function runTask (taskName, opts, cb) {
  tasksConfig[taskName] = Object.assign({}, tasksConfig[taskName], opts);
  gulp.parallel(taskName)(function () {
    if (typeof cb == 'function') { cb(); }
  });
};


/** ========== STYLES ========== **/
tasksConfig['styles:css'] = {
  src:           __.glob(config.root, ['*.css', '!_*.css'], true),
  dest:          config.dest,
  resolver:      config.resolver,
  assetResolver: config.assetResolver
};
gulp.task('styles:css', function (cb) {
  return tasks['styles:css'](tasksConfig['styles:css'], cb);
});

gulp.task('styles:css:watch', function () {
  var defaults = Object.assign({}, tasksConfig['styles:css']);

  var runAllFiles = function runAllFiles () {
    runTask('styles:css', defaults);
  };
  var runEntryFile = function runEntryFile (file) {
    runTask('styles:css', {
      src: file,
      base: config.root
    });
  };

  gulp
    .watch(__.glob(config.root, ['_*.css'], true))
    .on('change', runAllFiles)
    .on('add', runAllFiles)
    .on('unlink', runAllFiles)
  ;

  gulp
    .watch(__.glob(config.root, ['*.css', '!_*.css'], true))
    .on('change', runEntryFile)
    .on('add', runEntryFile)
  ;
});

tasksConfig['styles:scss'] = {
  src:           __.glob(config.root, ['*.scss', '!_*.scss'], true),
  dest:          config.dest,
  resolver:      config.resolver,
  assetResolver: config.assetResolver
};
gulp.task('styles:scss', function (cb) {
  return tasks['styles:scss'](tasksConfig['styles:scss'], cb);
});

gulp.task('styles:scss:watch', function () {
  var defaults = Object.assign({}, tasksConfig['styles:scss']);

  var runAllFiles = function runAllFiles () {
    runTask('styles:scss', defaults);
  };
  var runEntryFile = function runEntryFile (file) {
    runTask('styles:scss', {
      src: file,
      base: config.root
    });
  };

  gulp
    .watch(__.glob(config.root, ['_*.{sass,scss,css}'], true))
    .on('change', runAllFiles)
    .on('add', runAllFiles)
    .on('unlink', runAllFiles)
  ;

  gulp
    .watch(__.glob(config.root, ['*.{sass,scss}', '!_*.{sass,scss,css}'], true))
    .on('change', runEntryFile)
    .on('add', runEntryFile)
  ;
});

gulp.task('styles', gulp.parallel('styles:css', 'styles:scss'));
gulp.task('styles:watch', gulp.parallel('styles:css:watch', 'styles:scss:watch'));
gulp.task('styles:clean', function () {
  return del(__.glob(config.dest, '*.css', true), {read: false});
});
/** ========== //STYLES ========== **/

/** ========== PAGES ========== **/
tasksConfig['pages'] = {
  src:           __.glob(config.root, ['*.html', '!_*.html'], true),
  dest:          config.dest,
  resolver:      config.resolver,
  assetResolver: config.assetResolver
};
gulp.task('pages', function (cb) {
  return tasks['pages'](tasksConfig['pages'], cb);
});

gulp.task('pages:watch', function () {
  var defaults = Object.assign({}, tasksConfig['pages']);

  var runAllFiles = function runAllFiles () {
    runTask('pages', defaults);
  };
  var runEntryFile = function runEntryFile (file) {
    runTask('pages', {
      src: file,
      base: config.root
    });
  };

  gulp
    .watch(__.glob(config.root, ['_*.html'], true))
    .on('change', runAllFiles)
    .on('add', runAllFiles)
    .on('unlink', runAllFiles)
  ;

  gulp
    .watch(__.glob(config.root, ['*.html', '!_*.html'], true))
    .on('change', runEntryFile)
    .on('add', runEntryFile)
  ;
});
/** ========== //PAGES ========== **/

/** ========== SERVER ========== **/
gulp.task('server', function () {
  var server = __.server.run('server', config.server);
  server.watch(__.glob(config.server.server.baseDir, '*.*', true))
    .on('add', server.reload)
    .on('change', server.reload)
    .on('unlink', server.reload)
  ;
});
/** ========== //SERVER ========== **/

/** ========== FILES ========== **/
tasksConfig['files'] = {
  src:  __.glob(config.root, ['*.*', '!_*.*', '!*.{sass,scss,css,js,html}'], true),
  dest: config.dest
};
gulp.task('files', function (cb) {
  return tasks['files'](tasksConfig['files'], cb);
});

gulp.task('files:watch', function () {
  var runFile = function runFile (file) {
    runTask('files', {
      src: file,
      base: config.root
    });
  };

  gulp
    .watch(__.glob(config.root, ['*.*', '!_*.*', '!*.{sass,scss,css,js,html}'], true))
    .on('change', runFile)
    .on('add', runFile)
    // todo: удалять из `dest` удалённый в `src` файл
    //.on('unlink', function () {
    // /* new VinylPath */
    //})
  ;
});
gulp.task('files:clean', function () {
  return del(__.glob(config.dest, ['*.*', '!*.{css,js,html}'], true), {read: false});
});
/** ========== //FILES ========== **/







//gulp.task('pages', function () {
//  return gulp
//    .src(__.glob(config.tasks.root, '*.html', true), {
//      // При повторном запуске таска (например, через watch) выбирает только те файлы,
//      // которые изменились с заданной даты (сравнивает по дате модификации mtime)
//      //since: gulp.lastRun(options.taskName)
//    })
//    .pipe($.plumber({
//      errorHandler: $.notify.onError(err => ({
//        title:   'Html',
//        message: err.message
//      }))
//    }))
//    //.pipe(streams.pages.compileHtml({
//    //  resolver:       moduleResolver,
//    //  getAssetTarget: config.tasks.getAssetTarget
//    //}))
//    //.pipe($.tap(function (file) {
//    //  console.log('file', file.path);
//    //}))
//    // При повторном запуске таска выбирает только те файлы, которые изменились с прошлого запуска (сравнивает по
//    // названию файла и содержимому) $.cached - это замена since, но since быстрее, потому что ему не нужно полностью
//    // читать файл. Но since криво работает с ранее удалёнными и только что восстановленными через ctrl+z файлами.
//    //.pipe($.cached('files'))
//
//    // $.newer сравнивает проходящие через него файлы с файлами в _целевой_ директории и,
//    // если в целевой директории такие файлы уже есть, то не пропускает их.
//    // по логике, since работает после второго запуска, а $.newer сразу же, при первом.
//    // у $.newer'а можно замапить сравнение исходных файлов с целевыми.
//    //.pipe($.newer(config.tasks.files.dest))
//    .pipe(through(function(file, enc, callback) {
//      console.log($.util.colors.blue('basename'), file.basename);
//      console.log($.util.colors.blue('assets'), file.assets);
//    }))
//    .pipe($.if(config.env.isDev, $.debug({title: 'Html:'})))
//
//    .pipe(gulp.dest(config.tasks.dest))
//    ;
//});


/** ========== //FILES ========== **/

/** ========== SCRIPTS ========== **/
const gulplog       = require('gulplog');
const webpackStream = require('webpack-stream');
const webpack       = webpackStream.webpack;
const AssetsPlugin  = require('assets-webpack-plugin');
const through       = require('through2').obj;

let webpackConfig = require('../webpack.config.js');
let webpackTask = function webpackTask (options) {
  options = _.isPlainObject(options) ? options : {};
  options = extend(true, {}, webpackConfig, options);

  return function (cb) {
    options.plugins = _.isArray(options.plugins) ? options.plugins : [];
    if (!config.env.isProd) {

    }

    if (config.env.isProd) {
      /* 1 */
      //options.plugins.push(new AssetsPlugin({
      //  filename: 'scripts.json',
      //  path:     path.join(process.cwd(), 'dist/frontend-manifest'),
      //  processOutput(assets) {
      //    Object.keys(assets).forEach(function (key) {
      //      assets[key + '.js'] = assets[key].js.slice(options.output.publicPath.length);
      //      delete assets[key];
      //    });
      //
      //    return JSON.stringify(assets);
      //  }
      //}));

      options.plugins.push(new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false,
          drop_console: true,
          unsafe: true
        }
      }));
    }

    //- Stream -//

    let firstBuildReady = false;
    //let smOpts = {
    //  sourceRoot: '/js/sources',
    //  includeContent: true,
    //};

    return gulp
      .src(options.src, {
        //since: gulp.lastRun(options.taskName)
      })
      .pipe($.plumber({
        errorHandler: $.notify.onError(err => ({
          title:   'Webpack',
          message: err.message
        }))
      }))
      .pipe(streams.scripts.webpack(options), function done(err, stats) {
        firstBuildReady = true;

        if (err) { // hard error, see https://webpack.github.io/docs/node.js-api.html#error-handling
          return;  // emit('error', err) in webpack-stream
        }

        gulplog[stats.hasErrors() ? 'error' : 'info'](stats.toString({
          colors: true
        }));
      })
      //.pipe($.sourcemaps.init({loadMaps: true}))
      //.pipe(through(function (file, enc, cb) {
      //  var isSourceMap = /\.map$/.test(file.path);
      //  if (!isSourceMap) { this.push(file); }
      //  cb();
      //}))
      //.pipe($.if(config.env.isProd, $.uglify()))
      //.pipe($.if(
      //  config.env.isProd,
      //  $.sourcemaps.write('.', smOpts), // во внешний файл
      //  $.sourcemaps.write('', smOpts) // инлайн
      //))
      .pipe($.if(config.env.isDev, $.debug({title: 'Script:'})))
      .pipe(gulp.dest(options.dest))
      .on('data', function() {
        if (firstBuildReady) {
          cb();
        }
      })
      ;
  };
};

let webpackConfigRequired = {
  src: config.tasks.scripts.src,
  dest: config.tasks.scripts.dest,

  //profile: !config.env.isProd,
  devtool: !config.env.isProd ? '#module-cheap-inline-source-map' : '#source-map'
};

gulp.task('scripts', webpackTask(webpackConfigRequired));
gulp.task('scripts:watch', webpackTask(extend({}, webpackConfigRequired, {
  watch: true,
  watchOptions: {
    aggregateTimeout: 100
  }
})));

gulp.task('scripts:clean', function () {
  return del(config.tasks.scripts.clean, {read: false});
});
/** ========== //SCRIPTS ========== **/




  //var imgSrc = 'src/img/**';
  //var imgDest = 'build/img';
  //gulp.task('images', function() {
  //  return gulp
  //    .src(imgSrc)
  //    .pipe($.newer(imgDest))
  //    .pipe($.imagemin({
  //      optimizationLevel: 2, // png
  //      interlaced: true,     // gif
  //      progressive: true,    // jpg
  //      multipass: true,      // svg
  //      svgoPlugins: [
  //        { removeViewBox: false },               // don't remove the viewbox atribute from the SVG
  //        { removeUselessStrokeAndFill: false },  // don't remove Useless Strokes and Fills
  //        { removeEmptyAttrs: false }             // don't remove Empty Attributes from the SVG
  //      ],
  //      use: [
  //        PngQuant({
  //          quality: '80-90',
  //          speed: 4
  //        })
  //      ]
  //    }))
  //    .pipe(gulp.dest(imgDest));
  //});

gulp.task('clean', gulp.series(
  //gulp.parallel(
  //  'files:clean',
  //  'styles:clean',
  //  'scripts:clean'
  //)
  function clean () {
    return del(config.tasks.dest, {read: false});
  }
));

gulp.task('build', gulp.series(
  gulp.parallel(
    'styles',
    'scripts'
  ),
  'files'
));

gulp.task('rebuild', gulp.series(
  'clean',
  'build'
));

gulp.task('watch', gulp.parallel(
  'scripts:watch',
  'styles:watch',
  'files:watch'
));

gulp.task('dev', gulp.series(
  'rebuild',
  gulp.parallel(
    'watch',
    'server'
  )
));

gulp.task('dist', gulp.series(
  'rebuild',
  'server'
));




//
//
//// https://makeomatic.ru/blog/2014/12/06/Tips_and_Tricks/
//
//// https://gist.github.com/HPieters/88dd18e99c8925b2cabb
//// https://github.com/vigetlabs/gulp-starter/
//
//// https://github.com/BrowserSync/browser-sync/issues/786
//// http://alexfedoseev.com/post/54/frontend-project-build
//
//// http://ericlbarnes.com/setting-gulp-bower-bootstrap-sass-fontawesome/
//
//// http://habrahabr.ru/post/250569/#comment_8281675
//

