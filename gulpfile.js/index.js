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

const runTask        = function runTask (taskName, opts, cb) {
  tasksConfig[taskName] = Object.assign({}, tasksConfig[taskName], opts);
  gulp.parallel(taskName)(function () {
    if (typeof cb == 'function') { cb(); }
  });
};

if (config.env.isDev) {
  require('trace');
  require('clarify');
}

/** ========== STYLES ========== **/
tasksConfig['styles:css'] = {
  src:           __.glob(config.root, ['*.css', '!_*.css'], true),
  dest:          config.dest,
  resolver:      config.resolver,
  assetResolver: config.assetResolver
};
gulp.task('styles:css', function styles$css (cb) {
  return tasks['styles:css'](tasksConfig['styles:css'], cb);
});

gulp.task('styles:css:watch', function styles$css$watch () {
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
gulp.task('styles:scss', function styles$scss (cb) {
  return tasks['styles:scss'](tasksConfig['styles:scss'], cb);
});

gulp.task('styles:scss:watch', function styles$scss$watch () {
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
gulp.task('pages', function pages (cb) {
  return tasks['pages'](tasksConfig['pages'], cb);
});

gulp.task('pages:watch', function pages$watch () {
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
gulp.task('pages:clean', function pages$clean () {
  return del(__.glob(config.dest, ['*.html'], true), {read: false});
});
/** ========== //PAGES ========== **/

/** ========== FILES ========== **/
tasksConfig['files'] = {
  src:  __.glob(config.root, ['*.*', '!_*.*', '!*.{sass,scss,css,js,html}'], true),
  dest: config.dest
};
gulp.task('files', function files (cb) {
  return tasks['files'](tasksConfig['files'], cb);
});

gulp.task('files:watch', function files$watch () {
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
gulp.task('files:clean', function files$clean () {
  return del(__.glob(config.dest, ['*.*', '!*.{css,js,html}'], true), {read: false});
});
/** ========== //FILES ========== **/

/** ========== SCRIPTS ========== **/
const gulplog       = require('gulplog');
const webpackStream = require('webpack-stream');
const webpack       = webpackStream.webpack;
const AssetsPlugin  = require('assets-webpack-plugin');
const through       = require('through2').obj;

let webpackTask = function webpackTask (options) {
  options = _.isPlainObject(options) ? options : {};

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
      //.pipe($.plumber({
      //  errorHandler: $.notify.onError(err => ({
      //    title:   'Webpack',
      //    message: err.message
      //  }))
      //}))
      //.pipe(through(function (file, enc, cb) {
      //  console.log('= file.path', file.path);
      //  cb(null, file);
      //}))
      .pipe(streams.scripts.webpack(options, function done (err, stats) {
        firstBuildReady = true;

        if (err) { // hard error, see https://webpack.github.io/docs/node.js-api.html#error-handling
          return;  // emit('error', err) in webpack-stream
        }

        gulplog[stats.hasErrors() ? 'error' : 'info'](stats.toString({
          colors: true
        }));
      }))
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

let webpackConfig = require('../webpack.config.js');
let webpackConfigRequired = extend(true, {}, webpackConfig, {
  src: config.tasks.scripts.src,
  dest: config.tasks.scripts.dest,

  //profile: !config.env.isProd,
  devtool: !config.env.isProd ? '#module-cheap-inline-source-map' : '#source-map'
});

gulp.task('scripts', webpackTask(webpackConfigRequired));
gulp.task('scripts:watch', function (cb) {
  cb();
});
//gulp.task('scripts:watch', webpackTask(extend({}, webpackConfigRequired, {
//  watch: true,
//  watchOptions: {
//    aggregateTimeout: 100
//  }
//})));

gulp.task('scripts:clean', function scripts$clean (cb) {
  cb();
});
//gulp.task('scripts:clean', function scripts$clean () {
//  return del(__.glob(config.dest, ['*.js'], true), {read: false});
//});
/** ========== //SCRIPTS ========== **/

/** ========== SERVER ========== **/
gulp.task('server', function server () {
  var server = __.server.run('server', config.server);
  server.watch(__.glob(config.server.server.baseDir, '*.*', true))
    .on('add', server.reload)
    .on('change', server.reload)
    .on('unlink', server.reload)
  ;
});
/** ========== //SERVER ========== **/


gulp.task('clean', function clean () {
  return del(config.dest, {read: false});
});

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

