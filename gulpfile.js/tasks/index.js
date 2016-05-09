const $        = require('gulp-load-plugins')();
const _        = require('lodash');
const __       = require('../helpers');
const config   = require('../../scaffront.config.js');
const streams  = require('../streams');
const gulp     = require('gulp');
const combiner = require('stream-combiner2').obj;

function assertTask (options) {
  if (typeof options.src == 'undefined') {
    throw new TypeError('`src` is required');
  }
}


var tasks = {};

tasks['server'] = function () {
  var server = __.server.run('server', config.server);
  server.watch(__.glob(config.server.server.baseDir, '*.*', true))
    .on('add', server.reload)
    .on('change', server.reload)
    .on('unlink', server.reload)
  ;
};

tasks['styles:css'] = function (opts, cb) {
  opts = (_.isPlainObject(opts)) ? opts : {};
  assertTask(opts);

  var smOpts = {
    sourceRoot: '/css/sources',
    includeContent: true,
  };

  console.log('css opts.src', opts.src);

  var stream = gulp
    .src(opts.src, opts)
    //.pipe($.debug({title: 'CSS:'}))
    // todo: инкрементальность
    .pipe($.plumber({
      errorHandler: $.notify.onError(err => ({
        title:   'CSS',
        message: err.message
      }))
    }))
    .pipe($.sourcemaps.init({loadMaps: true}))
    .pipe(streams.styles.cssCompile({
      resolver:      opts.resolver || null,
      assetResolver: opts.assetResolver || null
    }));

  if (opts.dest) {
    stream = stream.pipe($.newer(opts.dest));
  }

  stream
    .pipe(streams.copyAssets())
    // todo: минификация изображений, svg, спрайты, шрифты, фоллбеки, полифиллы
    //.pipe($.if(config.env.isDev, $.debug({title: 'CSS:'})))
    .pipe($.if(
      config.env.isProd,
      $.sourcemaps.write('.', smOpts), // во внешний файл
      $.sourcemaps.write('', smOpts) // инлайн
    ))
  ;
  if (opts.dest) {
    stream = stream.pipe(gulp.dest(opts.dest));
  }

  return stream;
};


tasks['styles:scss'] = function (opts, cb) {
  opts = (_.isPlainObject(opts)) ? opts : {};
  assertTask(opts);

  console.log('styles:scss opts.src', opts.src);

  var smOpts = {
    sourceRoot: '/css/sources',
    includeContent: true,
  };

  var stream = gulp
    .src(opts.src, opts)
    //.pipe($.if(config.env.isDev, $.debug({title: 'Run SCSS:'})))
    .pipe($.plumber({
      errorHandler: $.notify.onError(err => ({
        title:   'SCSS',
        message: err.message
      }))
    }))
    .pipe($.sourcemaps.init({loadMaps: true}))
    .pipe(streams.styles.scssCompile({
      assetResolver: opts.assetResolver || null
    }))
    .pipe(streams.copyAssets())
    .pipe($.if(
      config.env.isProd,
      $.sourcemaps.write('.', smOpts), // во внешний файл
      $.sourcemaps.write('', smOpts) // инлайн
    ))
  ;

  if (opts.dest) {
    stream = stream.pipe(gulp.dest(opts.dest));
  }

  return stream;
};

tasks['files'] = function (opts, cb) {
  opts = (_.isPlainObject(opts)) ? opts : {};
  assertTask(opts);

  console.log('files opts.src', opts.src);

  var stream = gulp
    .src(opts.src, opts)
    //.pipe($.if(config.env.isDev, $.debug({title: 'Run SCSS:'})))
    .pipe($.plumber({
      errorHandler: $.notify.onError(err => ({
        title:   'File',
        message: err.message
      }))
    }))
  ;

  if (opts.dest) {
    stream = stream.pipe(gulp.dest(opts.dest));
  }

  return stream;
};


module.exports = tasks;