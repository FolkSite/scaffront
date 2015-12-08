var _                = require('lodash'),
    __               = require('../helpers'),
    ImagesConfig     = require('./images').config,
    gulp             = require('gulp'),
    gulpUtil         = require('gulp-util'),
    gulpFilter       = require('gulp-filter'),
    gulpFileInclude  = require('gulp-file-include'),
    path             = require('path'),
    sassCssImporter  = require('node-sass-css-importer'),
    assetFunctions   = require('node-sass-asset-functions'),
    gulpRename       = require('gulp-rename'),
    gulpAutoprefixer = require('gulp-autoprefixer'),
    gulpSass         = require('gulp-sass'),
    gulpSourcemaps   = require('gulp-sourcemaps'),
    gulpMinifyCss    = require('gulp-minify-css')
;


var config = {};

var importPaths = {
  node_modules: __.getPackagePath(),
  bower_components: __.getBowerPath(),
  compass: __.getBowerPath('compass-mixins/lib'),
  sassToolkit: __.getBowerPath('sass-toolkit/stylesheets'),
  sassyButtons: __.getBowerPath('sassy-buttons'),
  sassyMaps: __.getBowerPath('sassy-maps/sass'),
  sassyLists: __.getBowerPath('SassyLists/dist'),
  singularity: __.getBowerPath('singularity/stylesheets'),
  singularityQuickSpanner: __.getBowerPath('singularity-quick-spanner/stylesheets'),
  breakpointSass: __.getBowerPath('breakpoint-sass/stylesheets'),
  breakpointSlicer: __.getBowerPath('breakpoint-slicer/stylesheets'),
  scaffrontStyles: __.getBowerPath('scaffront-styles/stylesheets'),
};

config.src = 'app/styles';
config.dest = 'dist/css';

/**
 * @type {{build: {sass: StreamTransform, css: StreamTransform}, dist: StreamTransform}}
 */
config.transform = {
  build: {
    sass: function (stream) {
      var _importPaths = _.values(importPaths);

      stream = stream
        // здесь init не нужен, потому что gulpSass сам выставит нужные опции и сгенерирует все map'ы
        //.pipe(gulpSourcemaps.init())
        .pipe(gulpSass({
          precision: 10,
          functions: assetFunctions({
            images_path: (global.isProduction) ? 'dist/i' : 'app/images/inline',
            images_dir:  (global.isProduction) ? 'dist/i' : 'app/images/inline',
            http_images_path: '/i',
            http_generated_images_path: '/i',
          }),
          importer: sassCssImporter({
            import_paths: _importPaths
          }),
          includePaths: _importPaths,
          sourceMap: './',
          sourceMapContents: true,
          omitSourceMapUrl: true
        }).on('error', __.plumberErrorHandler.errorHandler))
        .pipe(gulpSourcemaps.write('./', {
          sourceRoot: './'
        }))
      ;

      return stream;
    },
    css: function (stream) {
      stream = stream
        .pipe(gulpSourcemaps.init({
          sourceRoot: './'
        }))
        .pipe(gulpFileInclude({
          prefix: '//= ',
          basepath: '@file'
        }))
        //.pipe(base64({
        //  baseDir:      'public',
        //  extensions:   ['jpg', 'png'],
        //  exclude:      [/\.server\.(com|net)\/dynamic\//, '--live.jpg'],
        //  maxImageSize: 32*1024, // размер указывается в байтах, тут он 32кб потому, что больше уже плохо для IE8
        //  debug: true
        //}))
        .pipe(gulpSourcemaps.write('./', {
          sourceRoot: './'
        }))
      ;

      return stream;
    },
  },
  dist: function (stream) {
    stream = stream
      .pipe(gulpSourcemaps.init({
        loadMaps: true,
        sourceRoot: './'
      }))
      .pipe(gulpAutoprefixer({
        browsers: [
          'last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'],
        cascade : false,
        remove  : true
      }))
      .pipe(gulpMinifyCss({
        compatibility: 'ie8'
      }))
      .pipe(gulpRename(function (path) {
        if (!path.basename.match(/\.min$/)) {
          path.basename += '.min';
        }
      }))
      .pipe(gulpSourcemaps.write('./', {
        sourceRoot: './'
      }))
    ;

    return stream;
  },
};

config.cleanups = {
  build: __.getGlobPaths(config.dest, ['css', 'css.map', '!min.css', '!min.css.map'], true),
  dist:  __.getGlobPaths(config.dest, ['min.css', 'min.css.map'], true)
};

/**
 * @type {Copier}
 * @property {Copier} [sass]
 * @property {Copier} [css]
 */
config.copier = [{
  from: __.getGlobPaths(__.getBowerPath('fancybox/source'), ['gif', 'png', 'jpg']),
  to: path.join(ImagesConfig.src.libs, 'fancybox')
}, {
  from: __.getGlobPaths(__.getBowerPath('magnific-popup/src/css'), ['scss']),
  to: path.join(config.src, 'libs/magnific-popup')
}];

module.exports.config = config;