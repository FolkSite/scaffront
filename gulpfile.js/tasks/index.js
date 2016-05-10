const $        = require('gulp-load-plugins')();
const _        = require('lodash');
const __       = require('../helpers');
const config   = require('../../scaffront.config.js');
const streams  = require('../streams');
const gulp     = require('gulp');
const through  = require('through2').obj;

function assertTask (options) {
  if (typeof options.src == 'undefined') {
    throw new TypeError('`src` is required');
  }
}

var tasks = {};

tasks['server'] = function () {
  var server = __.server.run('server', config.server);
  server.watch(__.glob(config.server.server.baseDir || config.dest, '*.*', true))
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

  stream = stream
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
    }));

  if (opts.dest) {
    stream = stream.pipe($.newer(opts.dest));
  }

  stream = stream
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

tasks['pages'] = function (opts, cb) {
  opts = (_.isPlainObject(opts)) ? opts : {};
  assertTask(opts);

  var stream = gulp
    .src(opts.src, opts)
    //.pipe($.if(config.env.isDev, $.debug({title: 'Run SCSS:'})))
    .pipe($.plumber({
      errorHandler: $.notify.onError(err => ({
        title:   'Page',
        message: err.message
      }))
    }))
    .pipe(streams.pages.htmlCompile({
      resolver:      opts.resolver || null,
      assetResolver: opts.assetResolver || null
    }));

  if (opts.dest) {
    stream = stream.pipe($.newer(opts.dest));
  }

  stream = stream.pipe(streams.copyAssets());

  if (opts.dest) {
    stream = stream.pipe(gulp.dest(opts.dest));
  }

  return stream;
};

const gulplog       = require('gulplog');
const webpackStream = require('webpack-stream');
const webpack       = webpackStream.webpack;

tasks['scripts'] = function (opts, cb) {
  opts = (_.isPlainObject(opts)) ? opts : {};
  assertTask(opts);

  opts.plugins = _.isArray(opts.plugins) ? opts.plugins : [];
  if (!config.env.isProd) {

  }

  if (config.env.isProd) {
    /* 1 */
    //opts.plugins.push(new AssetsPlugin({
    //  filename: 'scripts.json',
    //  path:     path.join(process.cwd(), 'dist/frontend-manifest'),
    //  processOutput(assets) {
    //    Object.keys(assets).forEach(function (key) {
    //      assets[key + '.js'] = assets[key].js.slice(opts.output.publicPath.length);
    //      delete assets[key];
    //    });
    //
    //    return JSON.stringify(assets);
    //  }
    //}));

    opts.plugins.push(new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        drop_console: true,
        unsafe: true
      }
    }));
  }

  //- Stream -//

  let firstBuildReady = false;
  let smOpts = {
    sourceRoot: '/js/sources',
    includeContent: true,
  };

  return gulp
    .src(opts.src)
    .pipe(streams.scripts.webpack(opts, webpack, function done (err, stats) {
      firstBuildReady = true;

      if (err) { // hard error, see https://webpack.github.io/docs/node.js-api.html#error-handling
        return;  // emit('error', err) in webpack-stream
      }

      gulplog[stats.hasErrors() ? 'error' : 'info'](stats.toString({
        colors: true
      }));
    }))
    .pipe($.sourcemaps.init({loadMaps: true}))
    .pipe(through(function (file, enc, cb) {
      var isSourceMap = /\.map$/.test(file.path);
      if (!isSourceMap) { this.push(file); }
      cb();
    }))
    .pipe($.if(config.env.isProd, $.uglify()))
    .pipe($.if(
      config.env.isProd,
      $.sourcemaps.write('.', smOpts), // во внешний файл
      $.sourcemaps.write('', smOpts) // инлайн
    ))
    .pipe($.if(config.env.isDev, $.debug({title: 'Script:'})))
    .pipe(gulp.dest(opts.dest))
    .on('data', function() {
      if (firstBuildReady) {
        cb();
      }
    })
  ;
};

tasks['files'] = function (opts, cb) {
  opts = (_.isPlainObject(opts)) ? opts : {};
  assertTask(opts);

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
    stream = stream
      .pipe($.newer(opts.dest))
      .pipe(gulp.dest(opts.dest));
  }

  return stream;
};


module.exports = tasks;