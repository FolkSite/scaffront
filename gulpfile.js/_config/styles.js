var bowerConfig      = require('./bower'),
    __               = require('../helpers'),
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

/**
 * @param {string} [directory]
 * @returns String
 */
var getPackagePath = function (directory) {
  return path.join('node_modules', directory || '');
};

/**
 * @param {string} [directory]
 * @returns String
 */
var getBowerPath = function (directory) {
  return path.join(bowerConfig.dirRelative, directory || '');
};

var importPaths = [
  getPackagePath(),
  getBowerPath(),
  getBowerPath('compass-mixins/lib'),
  getBowerPath('sass-toolkit/stylesheets'),
  getBowerPath('sassy-buttons'),
  getBowerPath('sassy-maps/sass'),
  getBowerPath('SassyLists/dist'),
  getBowerPath('singularity/stylesheets'),
  getBowerPath('singularity-quick-spanner/stylesheets'),
  getBowerPath('breakpoint-sass/stylesheets'),
  getBowerPath('breakpoint-slicer/stylesheets'),
  getBowerPath('scaffront-styles/stylesheets'),
];


config.src = 'app/styles';
config.dest = 'dist/css';

config.transform = {
  build: {
    sass: function (stream) {
      if (!stream) { return; }
      if (!gulpUtil.isStream(stream)) { return stream; }

      stream = stream
        .pipe(gulpSourcemaps.init())
        .pipe(gulpSass({
          precision: 10,
          functions: assetFunctions({
            images_path: (global.isProduction) ? 'dist/i' : 'app/images/design',
            images_dir:  (global.isProduction) ? 'dist/i' : 'app/images/design',
            http_images_path: '/i',
            http_generated_images_path: '/i',
          }),
          importer: sassCssImporter({
            import_paths: importPaths
          }),
          includePaths: importPaths
        }).on('error', __.plumberErrorHandler.errorHandler))
        .pipe(gulpSourcemaps.write('./'))
      ;

      return stream;
    },
    css: function (stream) {
      if (!stream) { return; }
      if (!gulpUtil.isStream(stream)) { return stream; }

      stream = stream
        .pipe(gulpFilter(function (file) {
          var is = __.Is(file);
          return !is.underscored;
        }))
        .pipe(gulpFileInclude({
          prefix: '//= ',
          basepath: '@file'
        }))
        //.pipe(base64({
        //  extensions: ['jpg', 'png'],
        //  maxImageSize: 32*1024 // размер указывается в байтах, тут он 32кб потому, что больше уже плохо для IE8
        //}))
      ;

      return stream;
    },
  },
  dist: function (stream) {
    if (!stream) { return; }
    if (!gulpUtil.isStream(stream)) { return stream; }

    stream = stream
      .pipe(gulpSourcemaps.init())
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
      .pipe(gulpSourcemaps.write('./'))
    ;

    return stream;
  },
};

config.dist = {
};

module.exports = config;