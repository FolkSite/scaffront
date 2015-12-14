var _                = require('lodash'),
    __               = require('../helpers'),
    extend           = require('extend'),
    path             = require('path'),
    gulp             = require('gulp'),
    gulpUtil         = require('gulp-util'),
    gulpFileInclude  = require('gulp-file-include'),
    sassCssImporter  = require('node-sass-css-importer'),
    assetFunctions   = require('node-sass-asset-functions'),
    gulpRename       = require('gulp-rename'),
    gulpAutoprefixer = require('gulp-autoprefixer'),
    gulpBase64       = require('gulp-base64'),
    gulpSass         = require('gulp-sass'),
    gulpSourcemaps   = require('gulp-sourcemaps'),
    gulpMinifyCss    = require('gulp-minify-css'),
    gulpTap          = require('gulp-tap'),
    del              = require('del'),
    getObject        = require('getobject'),
    gulpChanged      = require('gulp-changed'),
    runSequence      = require('run-sequence').use(gulp),
    gulpPlumber      = require('gulp-plumber')
;


var server       = null,
    config       = require('../config'),
    stylesConfig = config.styles.config,
    copierUtils  = config.copier.utils,
    serverConfig = config.server.config,
    serverUtils  = config.server.utils;

console.log('__.preparePath({startSlash: true}, stylesConfig.dest)', __.preparePath({startSlash: true}, path.relative(global.Builder.dest, stylesConfig.dest)));

gulp.task('styles:sass', function () {
  var _importPaths = _.values(stylesConfig.importPaths);

  var stream = gulp.src(__.getGlobPaths(stylesConfig.src, stylesConfig.extnames.sass))
    .pipe(gulpPlumber(__.plumberErrorHandler))

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
        sourceRoot: './',
        sourceMappingURLPrefix: __.preparePath({
          startSlash: true
        }, path.relative(global.Builder.dest, stylesConfig.dest))
      }))

    .pipe(gulp.dest(stylesConfig.dest))
  ;

  server && serverUtils.reloadServer(serverConfig.devServerName, stream, {
    match: '**/*.css'
  });

  return stream;
});

gulp.task('styles:css', function () {
  var stream = gulp.src(__.getGlobPaths(stylesConfig.src, stylesConfig.extnames.css))
    .pipe(gulpPlumber(__.plumberErrorHandler))

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
      //  maxImageSize: 32*1024,
      //  debug: true
      //}))
      .pipe(gulpSourcemaps.write('./', {
        sourceRoot: './'
      }))

    .pipe(gulp.dest(stylesConfig.dest))
  ;

  server && serverUtils.reloadServer(serverConfig.devServerName, stream, {
    match: '**/*.css'
  });

  return stream;
});


gulp.task('styles:copier', function () {
  return copierUtils.copy(getObject.get(stylesConfig, 'copier'));
});

gulp.task('styles:copier:cleanup', function () {
  return copierUtils.cleanup(getObject.get(stylesConfig, 'copier'));
});


gulp.task('styles:build', function (cb) {
  runSequence('styles:copier', ['styles:sass', 'styles:css'], cb);
});

gulp.task('styles:build:cleanup', function (cb) {
  runSequence(['styles:copier:cleanup'], function () {
    if (!getObject.get(stylesConfig, 'cleanups.build') || !stylesConfig.cleanups.build) {
      cb();
      return;
    }

    return del(stylesConfig.cleanups.build).then(function () {
      cb();
    }).catch(cb);
  });
});


gulp.task('styles:dist', function (cb) {
  runSequence('styles:build', function () {
    var stream = gulp.src(__.getGlobPaths(stylesConfig.dest, ['css', '!min.css'], true))
      .pipe(gulpPlumber(__.plumberErrorHandler))

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

      .pipe(gulp.dest(stylesConfig.dest))
    ;

    stream.on('end', cb);

    return stream;
  });
});

gulp.task('styles:dist:cleanup', function (cb) {
  runSequence('styles:build:cleanup', function () {
    return del(__.getGlobPaths(stylesConfig.dest, ['min.css', 'min.css.map'], true)).then(function () {
      cb();
    }).catch(cb);
  });
});


gulp.task('styles:watch', function () {
  server = serverUtils.runServer(serverConfig.devServerName);

  gulp.watch(__.getGlobPaths(stylesConfig.src, ['scss', 'sass'], true), ['styles:sass']);
  gulp.watch(__.getGlobPaths(stylesConfig.src, ['css'], true),          ['styles:css']);

  var copiers = getObject.get(stylesConfig, 'copier');
  if (copiers) {
    copiers = (!_.isArray(copiers)) ? [copiers] : copiers;
    copiers = _.map(copiers, function (copier) {
      return __.getCopier(copier).from;
    });
    copiers = _.compact(copiers);
    copiers.length && gulp.watch(copiers, ['styles:copier']);
  }
});

