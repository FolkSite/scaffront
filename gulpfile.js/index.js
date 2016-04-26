'use strict';

const _        = require('lodash');
const __       = require('./helpers');
const $        = require('gulp-load-plugins')();
const gulp     = require('gulp');
const del      = require('del');
const path     = require('path');
const merge    = require('merge-stream');
const extend   = require('extend');
const combiner = require('stream-combiner2').obj;

const envs    = require('../scaffront.env.js');
const config = envs;
const streams = require('./streams');

var noopTask = function noopTask (cb) { cb(null) };

/**
 * @param {string} filePath
 * @param {string} baseDir
 * @param {string} targetDir
 * @returns {string}
 */
var resolveTargetFile = function resolveTargetFile (filePath, baseDir, targetDir) {
  'use strict';

  filePath  = __.preparePath(filePath, {startSlash: true, trailingSlash: false});
  baseDir   = __.preparePath(baseDir, {startSlash: true, trailingSlash: true});
  targetDir = __.preparePath(targetDir, {startSlash: true, trailingSlash: true});

  var parsedFilePath        = __.parsePath(filePath);
  var fileName              = parsedFilePath.base;
  var fileDirWithoutBaseDir = path.relative(baseDir, parsedFilePath.dir);
  var targetFile            = path.join(targetDir, fileDirWithoutBaseDir, fileName);

  return targetFile;
};

//const config = require('./config');

//if (!config.env.isDev) {
//  require('trace');
//  require('clarify');
//}

/** ========== SERVER ========== **/
gulp.task('server', function () {
  var server = __.server.run('dev', config.servers.dev);
  //server.watch('dist/frontend/**/*.*')
  server.watch(__.glob(config.tasks.dest, '*.*', true))
    .on('add', server.reload)
    .on('change', server.reload)
    .on('unlink', server.reload)
  ;
});
/** ========== //SERVER ========== **/

/** ========== ROOT FILES ========== **/
gulp.task('root-files:build', function () {
  var options = {
    src: __.getGlob('app/frontend/root', '*.*', true),
    dist: 'dist/frontend'
  };

  return combiner(
    gulp.src(options.src, {
      // При повторном запуске таска (например, через watch) выбирает только те файлы,
      // которые изменились с заданной даты (сравнивает по дате модификации mtime)
      //since: gulp.lastRun(options.taskName)
    }),
    // При повторном запуске таска выбирает только те файлы, которые изменились с прошлого запуска (сравнивает по
    // названию файла и содержимому) $.cached - это замена since, но since быстрее, потому что ему не нужно полностью
    // читать файл. Но since криво работает с ранее удалёнными и только что восстановленными через ctrl+z файлами.
    $.cached('root-files'),

    // $.newer сравнивает проходящие через него файлы с файлами в _целевой_ директории и,
    // если в целевой директории такие файлы уже есть, то не пропускает их.
    // по логике, since работает после второго запуска, а $.newer сразу же, при первом.
    // у $.newer'а можно замапить сравнение исходных файлов с целевыми.
    $.newer(options.dist),
    $.if(config.env.isDev, $.debug({title: 'Root file:'})),

    gulp.dest(options.dist)
  ).on('error', $.notify.onError(err => ({
    title: 'Copy root files',
    message: err.message
  })));
});

gulp.task('root-files:watch', function () {
  gulp
    .watch(__.getGlob('app/frontend'), gulp.series('root-files:build'))
    .on('unlink', function (filepath) {
      var file = path.resolve(filepath);
      if ($.cached.caches['root-files']) {
        delete $.cached.caches['root-files'][file];
      }
    })
  ;
});

gulp.task('root-files:dist', gulp.series('root-files:build', function (cb) {
  cb();
}));

gulp.task('root-files:clean', noopTask);
/** ========== //ROOT FILES ========== **/

/** ========== ASSETS ========== **/
//gulp.task('root-files:build', function () {
//  var options = {
//    src: __.getGlob('app/frontend/root', '*.*', true),
//    dist: 'dist/frontend'
//  };
//
//  return combiner(
//    gulp.src(options.src, {
//      // При повторном запуске таска (например, через watch) выбирает только те файлы,
//      // которые изменились с заданной даты (сравнивает по дате модификации mtime)
//      //since: gulp.lastRun(options.taskName)
//    }),
//    // При повторном запуске таска выбирает только те файлы, которые изменились с прошлого запуска (сравнивает по
//    // названию файла и содержимому) $.cached - это замена since, но since быстрее, потому что ему не нужно полностью
//    // читать файл. Но since криво работает с ранее удалёнными и только что восстановленными через ctrl+z файлами.
//    $.cached('root-files'),
//
//    // $.newer сравнивает проходящие через него файлы с файлами в _целевой_ директории и,
//    // если в целевой директории такие файлы уже есть, то не пропускает их.
//    // по логике, since работает после второго запуска, а $.newer сразу же, при первом.
//    // у $.newer'а можно замапить сравнение исходных файлов с целевыми.
//    $.newer(options.dist),
//    $.if(config.env.isDev, $.debug({title: 'Root file:'})),
//
//    gulp.dest(options.dist)
//  ).on('error', $.notify.onError(err => ({
//    title: 'Copy root files',
//    message: err.message
//  })));
//});
//
//gulp.task('root-files:watch', function () {
//  gulp
//    .watch(__.getGlob('app/frontend'), gulp.series('root-files:build'))
//    .on('unlink', function (filepath) {
//      var file = path.resolve(filepath);
//      if ($.cached.caches['root-files']) {
//        delete $.cached.caches['root-files'][file];
//      }
//    })
//  ;
//});
//
//gulp.task('root-files:dist', gulp.series('root-files:build', function (cb) {
//  cb();
//}));
//
//gulp.task('root-files:clean', noopTask);
/** ========== //ROOT FILES ========== **/

/** ========== STYLES ========== **/

/*
 Переписать на scss: https://github.com/jonathantneal/postcss-short-position
 Что-то похожее на центрирование:
 https://github.com/jedmao/postcss-center

 https://github.com/postcss/postcss-import
 https://github.com/postcss/postcss-url
 https://github.com/postcss/postcss/blob/master/docs/writing-a-plugin.md

 Скаффолдер для плагинов под PostCSS:
 https://github.com/postcss/postcss-plugin-boilerplate

 Автоматические стайлгайды!
 https://github.com/morishitter/postcss-style-guide

 Форматирование стилей:
 https://github.com/ben-eb/perfectionist

 Сообщения об ошибках "компиляции", как в SCSS (body:before)
 https://github.com/postcss/postcss-browser-reporter
 require('postcss-browser-reporter')

 Ещё один месседжер:
 https://github.com/postcss/postcss-reporter

 Отфильтровывает файлы из потока и применяет плагин:
 https://github.com/tsm91/postcss-filter-stream
 filterStream('**\/css/vendor/**', colorguard()),

 H5BP'ые in-/visible хелперы:
 https://github.com/lukelarsen/postcss-hidden

 http://e-planet.ru/company/blog/poleznye-snippety-dlja-sass.html
 https://www.npmjs.com/package/image-size

 Ассеты и шрифты:
 http://postcss.parts/tag/images
 http://postcss.parts/tag/svg
 https://github.com/justim/postcss-svg-fallback
 https://github.com/jonathantneal/postcss-font-magician
 https://github.com/geut/postcss-copy

 https://github.com/tars/tars-scss
 https://toster.ru/q/256261
 https://github.com/glebmachine/postcss-cachebuster
 */


var browsers = ['last 4 versions', 'ie 8-9', '> 2%'];
var postCssProcessors = [
  require('postcss-import')({
    root: process.cwd(),
    path: [],
    //resolve: function (id, basedir, importOptions) { /*require.resolve(...);*/ }
  })
];
var postCssTasksForCss = $.postcss(postCssProcessors);
var postCssTasksForAnyStyles = $.postcss([
  require('postcss-pseudo-content-insert'),
  require('postcss-focus'),
  require('postcss-single-charset')(),
  require('postcss-easings')({
    easings: require('postcss-easings').easings
  })
]);
var postCssProcessorsFallbacks = [
  require('postcss-color-rgba-fallback')({
    properties: ['background-color', 'background', 'color', 'border', 'border-color', 'outline', 'outline-color'],
    oldie: true,
    backgroundColor: [255, 255, 255]
  }),
  require('postcss-gradient-transparency-fix'),
  require('postcss-single-charset')(),
  require('postcss-will-change'),
  require('pixrem')({
    // `pixrem` tries to get the root font-size from CSS (html or :root) and overrides this option
    //rootValue: 16px,
    replace: false,
    atrules: true,
    browsers: browsers,
    unitPrecision: 10
  }),
  require('postcss-pseudoelements')({
    selectors: ['before','after','first-letter','first-line']
  }),
  require('postcss-vmin'),
  require('postcss-opacity'),
  require('postcss-filter-gradient'),
  require('postcss-input-style'),
  require('postcss-unroot')({
    method: 'copy'
  }),
  //require('postcss-svg-fallback')({
  //  // base path for the images found in the css
  //  // this is most likely the path to the css file you're processing
  //  // not setting this option might lead to unexpected behavior
  //  basePath: '',
  //
  //  // destination for the generated SVGs
  //  // this is most likely the path to where the generated css file is outputted
  //  // not setting this option might lead to unexpected behavior
  //  dest: '',
  //
  //  // selector that gets prefixed to selector
  //  fallbackSelector: '.no-svg',
  //
  //  // when `true` only the css is changed (no new files created)
  //  disableConvert: false,
  //}),
  // с `postcss-unmq` надо разобраться на тему -
  // как засунуть получившиеся стили в поток отдельным файлом
  //require('postcss-unmq')({
  //  // these are already the default options
  //  type: 'screen',
  //  width: 1024,
  //  height: 768,
  //  resolution: '1dppx',
  //  color: 3
  //}),
];
var postCssProcessorsDist = [
  require('cssnano')({
    autoprefixer: {
      browsers: browsers,
      cascade: false
    },
    calc: {},
    colormin: {legacy : false},
    convertValues: {length: false},
    discardComments: {},
    discardDuplicates: {},
    discardEmpty: {},
    discardUnused: {},
    filterPlugins: {},
    mergeIdents: {},
    mergeLonghand: {},
    mergeRules: {},
    minifyFontValues: {},
    minifyGradients: {},
    minifySelectors: {},
    normalizeCharset: {},
    normalizeUrl: {},
    orderedValues: {},
    reduceIdents: {},
    reduceTransforms: {},
    svgo: {},
    uniqueSelectors: {},
    zindex: {}
  })
];

gulp.task('styles:css:build', function () {
  var smOpts = {
    sourceRoot: '/css/sources',
    includeContent: true,
  };

  return gulp
    .src(config.tasks.styles.css.src, {
      //since: gulp.lastRun(options.taskName)
    })
    .pipe($.plumber({
      errorHandler: $.notify.onError(err => ({
        title:   'CSS',
        message: err.message
      }))
    }))
    .pipe(streams.styles.css())
    .pipe($.if(
      envs.isProd,
      $.sourcemaps.write('.', smOpts), // во внешний файл
      $.sourcemaps.write('', smOpts) // инлайн
    ))
    .pipe(gulp.dest(config.tasks.styles.dest))
  ;

/*
   Описание $.remember, $.cached здесь:
   https://youtu.be/uYZPNrT-e-8?t=240
*/
  //return combine(
  //  $.cached('styles'),
  //
  //  $.if(config.env.isDev, $.debug({title: 'Style:'})),
  //
  //  gulp.dest(options.dist)
  //)
  //  .on('error', $.notify.onError(err => ({
  //    title: 'CSS styles',
  //    message: err.message
  //  })));
  //
  //
  //return combiner(
  //  gulp.src(options.src, {
  //    //since: gulp.lastRun(options.taskName)
  //  }),
  //  // $.remember запоминает все файлы, которые через него проходят, в своём внутреннем кеше ('css' - это ключ кеша)
  //  // и потом, если в потоке они отсутствуют, добавляет их
  //  // (это может произойти, если перед ним установлен since/$.cached/$.newer - они пропускают только изменённые файлы,
  //  // исключая из gulp.src не изменившееся). но если какой-то файл из src-потока удалён с диска, то $.remember
  //  // всё-равно будет его восстанавливать. для избежания подобного поведения, в watch-таске заставляем $.remember
  //  // забыть об удалённых файлах. $.remember('css'),
  //
  //  // инклюдим файлы
  //  //$.include(),
  //
  //  // При повторном запуске таска выбирает только те файлы, которые изменились с прошлого запуска (сравнивает по
  //  // названию файла и содержимому) $.cached - это замена since, но since быстрее, потому что ему не нужно полностью
  //  // читать файл. Ещё since криво работает с ранее удалёнными и только что восстановленными через ctrl+z файлами.
  //  $.cached('css'),
  //
  //  $.if(config.env.isDev, $.debug({title: 'CSS style:'})),
  //
  //  postCssTasksForCss,
  //
  //  gulp.dest(options.dist)
  //).on('error', $.notify.onError(err => ({
  //  title: 'CSS styles',
  //  message: err.message
  //})));
});

gulp.task('styles:scss:build', function () {
  var smOpts = {
    sourceRoot: '/css/sources',
    includeContent: true,
  };

  return gulp
    .src(config.tasks.styles.scss.src, {
      //since: gulp.lastRun(options.taskName)
    })
    .pipe($.plumber({
      errorHandler: $.notify.onError(err => ({
        title:   'SCSS',
        message: err.message
      }))
    }))
    .pipe(streams.styles.scss())
    .pipe($.if(
      envs.isProd,
      $.sourcemaps.write('.', smOpts), // во внешний файл
      $.sourcemaps.write('', smOpts) // инлайн
    ))
    .pipe(gulp.dest(config.tasks.styles.dest))
  ;
});

gulp.task('styles:css:watch', function () {
  var options = {
    basePath: 'app/frontend/css',
    targetPath: 'dist/frontend/css'
  };

  gulp
    .watch(__.getGlob(options.basePath, '*.css', true), gulp.series('styles:css:build'))
    .on('unlink', function (filepath) {
      var file = path.resolve(filepath);
      if ($.cached.caches['css']) {
        delete $.cached.caches['css'][file];
      }

      var targetFile = resolveTargetFile(filepath, options.basePath, options.targetPath);

      if (__.isFile(targetFile)) {
        del.sync(path.join(process.cwd(), targetFile));
      }
    })
  ;

});
//- //Simple CSS styles -//

gulp.task('styles:watch', gulp.parallel(
  'styles:css:watch'
  //, 'styles:scss:watch'
));

gulp.task('styles:build', gulp.series(
  gulp.parallel('styles:css:build', 'styles:scss:build')
  //,function (cb) {
  //  cb();
  //}
));

gulp.task('styles:clean', function () {
  return del(config.tasks.styles.clean, {read: false});
});
/** ========== //STYLES ========== **/

/** ========== SCRIPTS ========== **/
const gulplog       = require('gulplog');
const webpackStream = require('webpack-stream');
const webpack       = webpackStream.webpack;
const AssetsPlugin  = require('assets-webpack-plugin');
const through       = require('through2').obj;

let webpackConfig = require('../webpack.config.js');
let webpackTask = function webpackTask (options) {
  let config = extend(true, {}, webpackConfig);

  options = _.isPlainObject(options) ? options : {};

  return function (cb) {
    config.plugins = _.isArray(config.plugins) ? config.plugins : [];
    if (!envs.isProd) {

    }

    if (envs.isProd) {
      /* 1 */
      //config.plugins.push(new AssetsPlugin({
      //  filename: 'scripts.json',
      //  path:     path.join(process.cwd(), 'dist/frontend-manifest'),
      //  processOutput(assets) {
      //    Object.keys(assets).forEach(function (key) {
      //      assets[key + '.js'] = assets[key].js.slice(config.output.publicPath.length);
      //      delete assets[key];
      //    });
      //
      //    return JSON.stringify(assets);
      //  }
      //}));

      config.plugins.push(new webpack.optimize.UglifyJsPlugin({
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
      .pipe(streams.scripts.webpack(extend(true, config, options), function done(err, stats) {
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
      //.pipe($.if(envs.isProd, $.uglify()))
      //.pipe($.if(
      //  envs.isProd,
      //  $.sourcemaps.write('.', smOpts), // во внешний файл
      //  $.sourcemaps.write('', smOpts) // инлайн
      //))
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

  profile: !envs.isProd,
  devtool: !envs.isProd ? '#module-cheap-inline-source-map' : '#source-map'
};

gulp.task('scripts:build', webpackTask(webpackConfigRequired));
gulp.task('scripts:watch', webpackTask(extend({}, webpackConfigRequired, {
  watch: true,
  watchOptions: {
    aggregateTimeout: 100
  }
})));

gulp.task('scripts:cleaner', function () {
  return del(config.tasks.scripts.clean, {read: false});
});

/** ========== //SCRIPTS ========== **/












  //var imgSrc = 'src/img/**';
  //var imgDest = 'build/img';
  //
  //// Minify any new images
  //gulp.task('images', function() {
  //
  //  // Add the newer pipe to pass through newer images only
  //  return gulp.src(imgSrc)
  //    .pipe($.newer(imgDest))
  //    .pipe($.imagemin())
  //    .pipe(gulp.dest(imgDest));
  //
  //});

gulp.task('clean', function() {
  return del('dist/frontend', {read: false});
});

gulp.task('build', gulp.series(
  gulp.parallel('root-files:build', 'styles:build')
));



gulp.task('watch', gulp.parallel(
  'styles:watch',
  'root-files:watch'
));

gulp.task('dev', gulp.series(
  'clean',
  'build',
  //'server',
  gulp.parallel(
    'server',
    'watch'
  )
));










//
//return;
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
//
//
////'use strict';
//
////var config = require('./_config/');
////var Gulp = require('gulp');
////var Path = require('path');
//
////var tasks = require('require-dir')('./tasks', {
////  recurse: true
////});
//
//
//var gulp            = require('gulp'),
//    gulpUtil        = require('gulp-util'),
//    runSequence     = require('run-sequence').use(gulp)
//;
//
//require('./tasks/fonts');
//require('./tasks/styles/styles');
//require('./tasks/copier');
//require('./tasks/pages');
////require('./tasks/scripts');
////require('./tasks/images');
//
//
//gulp.task('build', function (cb) {
//  runSequence(
//    [
//      'fonts:build',
//      //'images:build',
//      'copier:build'
//    ],
//    [
//      'styles:build',
//      //'scripts:build'
//    ],
//    [
//      'pages:build',
//    ],
//    cb
//  );
//});
//
//gulp.task('build:cleanup', function (cb) {
//  runSequence(
//    [
//      'fonts:build:cleanup',
//      //'images:build:cleanup',
//      'copier:build:cleanup'
//    ],
//    [
//      'styles:build:cleanup',
//      //'scripts:build:cleanup'
//    ],
//    [
//      'pages:build:cleanup',
//    ],
//    cb
//  );
//});
//
//
//gulp.task('dist', function (cb) {
//  runSequence(
//    [
//      'fonts:dist',
//      //'images:dist',
//      'copier:dist'
//    ],
//    [
//      'styles:dist',
//      //'scripts:dist'
//    ],
//    [
//      'pages:dist',
//    ],
//    cb
//  );
//});
//
//gulp.task('dist:cleanup', function (cb) {
//  runSequence(
//    [
//      'fonts:dist:cleanup',
//      //'images:dist:cleanup',
//      'copier:dist:cleanup'
//    ],
//    [
//      'styles:dist:cleanup',
//      //'scripts:dist:cleanup'
//    ],
//    [
//      'pages:dist:cleanup',
//    ],
//    cb
//  );
//});
//
//
//gulp.task('watch', function (cb) {
//  runSequence(
//    [
//      'fonts:watch',
//      //'images:watch',
//      'copier:watch'
//    ],
//    [
//      'styles:watch',
//      //'scripts:watch'
//    ],
//    [
//      'pages:watch',
//    ],
//    cb
//  );
//});
//
//
//
////return;
////
////
////var Gulp = require('gulp'),
////    Extend = require('extend'),
////    //Changed = require('gulp-changed'),
////    Tap = require('gulp-tap'),
////    Filter = require('gulp-filter'),
////    Callback = require('gulp-callback'),
////    Plumber = require('gulp-plumber'),
////    Concat = require('gulp-concat'),
////    Autoprefixer = require('gulp-autoprefixer'),
////    Sass = require('gulp-ruby-sass'),
////    Rename = require('gulp-rename'),
////    Sourcemaps = require('gulp-sourcemaps'),
////    FileInclude = require('gulp-file-include'),
////    ImageMin = require('gulp-imagemin'),
////    PngQuant = require('imagemin-pngquant'),
////    RimRaf = require('rimraf'),
////    Csso = require('gulp-csso'),
////    Uglify = require('gulp-uglify'),
////    //closureCompiler = require('gulp-closure-compiler'),
////    AutoPolyfiller = require('gulp-autopolyfiller'),
////    Cache = require('gulp-cached'),
////    //Clean = require('gulp-clean'),
////    Order = require('gulp-order'),
////    RunSequence = require('run-sequence').use(Gulp),
////    BrowserSync = require('browser-sync'),
////    Path = require('path'),
////    MkPath = require('mkpath'),
////    CriticalCSS = require('criticalcss'),
////    FS = require('fs'),
////    Crypto = require('crypto'),
////    Merge = require('event-stream').merge,
////    //Nightmare = require('nightmare'),
////    //Phantom = require('phantom'),
////    _ = require('lodash'),
////    del = require('del'),
////    Helpers = require('./helpers/index');
////
//////var Wrap = require('gulp-wrap');
////
//////var vinylPaths = require('vinyl-paths');
//////gulp.task('log', function () {
//////  return gulp.src('app/*')
//////    .pipe(vinylPaths(function (paths) {
//////      console.log('Paths:', paths);
//////      return Promise.resolve();
//////    }));
//////});
////
////
////var md5 = function (content) {
////  return Crypto.createHash('md5').update(content).digest('hex');
////};
////
////var Is = function (file) {
////  var extname = Path.extname(file.path);
////  var filename = Path.basename(file.path, extname);
////
////  return {
////    css: extname === '.css',
////    scss: extname === '.scss',
////    sass: extname === '.sass',
////    js: extname === '.js',
////    minified: /\.min$/.test(filename),
////    underscored: /^_/.test(filename)
////  };
////};
////
////
////var paths = {
////  dist: {
////    html: 'dist/',
////    js: 'dist/js/',
////    jsPlugins: 'dist/js/libs/',
////    jsVendors: 'dist/js/vendor/',
////    css: 'dist/css/',
////    criticalCss: 'dist/css/critical/',
////    images: {
////      inline: 'dist/i/',
////      content: 'dist/images/'
////    },
////    fonts: 'dist/css/fonts-tocss/'
////  },
////  src: {
////    html: 'app/html-asis/**/*.html',
////    root: 'app/root/**/*.*',
////    js: [
////      'app/js/**/*.js',
////      '!app/js/vendor/**/*.*'
////    ],
////    jsVendors: 'app/js/vendor/**/*.*',
////    //css: 'app/css/*.(scss|sass)',
////    css: 'app/styles/*.css',
////    sass: 'app/styles/',
////    images: {
////      inline: 'app/images/design/**/*.*',
////      content: 'app/images/content/**/*.*'
////    },
////    fonts: 'app/fonts-tocss/**/*.*'
////  },
////  watch: {
////    root: 'app/root/**/*.*',
////    html: 'app/html-asis/**/*.html',
////    js: 'app/js/**/*.js',
////    css: 'app/styles/**/*.css',
////    //sass: ['app/styles/*.scss', 'app/styles/.sass'],
////    sass: 'app/styles/**/*.@(scss|sass)',
////    images: {
////      inline: 'app/images/design/**/*.*',
////      content: 'app/images/content/**/*.*'
////    },
////    fonts: 'app/fonts-tocss/**/*.*'
////  },
////  clean: 'dist'
////};
////
////var config = {
////  phantomJsPath: Path.join(Path.dirname(require('phantomjs').path), '/'),
////  criticalCss: {
////    injectFiles: [
////      //'criticalcss/jquery-1.11.2.min.js',
////      'criticalcss/Url.js',
////      'criticalcss/collectCss.js'
////    ]
////  },
////  FileInclude: {
////    prefix: '//= ',
////    basepath: '@file'
////  },
////  Autoprefixer: {
////    browsers: [
////      'last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'],
////    cascade : false,
////    remove  : true
////  },
////  AutoPolyfiller: {
////    browsers: ['last 3 version', 'ie 8', 'ie 9']
////  },
////  BrowserSync: {
////    port: 666,
////    server: {
////      baseDir: 'dist'
////    }
////  },
////  BrowserSyncDist: {
////    port: 1313,
////    open: false,
////    server: {
////      baseDir: 'dist'
////    }
////  },
////  ImageMin: {
////    optimizationLevel: 2, // png
////    interlaced: true,     // gif
////    progressive: true,    // jpg
////    multipass: true,      // svg
////    svgoPlugins: [
////      { removeViewBox: false },               // don't remove the viewbox atribute from the SVG
////      { removeUselessStrokeAndFill: false },  // don't remove Useless Strokes and Fills
////      { removeEmptyAttrs: false }             // don't remove Empty Attributes from the SVG
////    ],
////    use: [
////      PngQuant({
////        quality: '80-90',
////        speed: 4
////      })
////    ]
////  }
////};
////
////Gulp.task('removeDist', function (cb) {
////  RimRaf(paths.clean, cb);
////});
////Gulp.task('copyroot', function () {
////  return Gulp.src(paths.src.root)
////    .pipe(Plumber(Helpers.plumberErrorHandler))
////    .pipe(Gulp.dest(paths.dist.html));
////});
////
////Gulp.task('fonts:build', function () {
////  return Gulp.src(paths.src.fonts)
////    .pipe(Plumber(Helpers.plumberErrorHandler))
////    .pipe(Gulp.dest(paths.dist.fonts));
////});
////Gulp.task('fonts:dist', function (cb) {
////  return RunSequence('fonts:build', cb);
////});
////
////var getRelativePath = function (from, to) {
////  var result = '';
////  from = from || null;
////  to = to || null;
////
////  if (!from) { return result; }
////
////  if (to) {
////    result = Path.relative(from, to);
////  } else if (Path.isAbsolute(from)) {
////    result = from.substr(1);
////  } else {
////    result = from;
////  }
////
////  return result;
////};
////
/////**
//// * @param {String} path
//// * @returns {Boolean}
//// */
////var hasTrailingSlash = function (path) {
////  path = path.toString() || '';
////  if (!path) { return ''; }
////
////  var lastChar = path.substr(path.length - 1);
////  return (lastChar == '/' || lastChar == '\\')
////};
////
/////**
//// * @param {String} path
//// * @returns {boolean}
//// */
////var isFile = function (path) {
////  path = path.toString() || '';
////  if (!path) { return false; }
////
////  return (!!Path.extname(path) && !hasTrailingSlash(path));
////};
////
/////**
//// *
//// * @param {{startSlash: Boolean, trailingSlash: Boolean}} [config]
//// * @param {String} [path]
//// * @param {...} [toJoin]
//// */
////var preparePath = function (config, path, toJoin) {
////  var args = _.toArray(arguments);
////
////  if (_.isPlainObject(args[0])) {
////    config = args[0];
////    path = args[1];
////    toJoin = args.slice(2);
////  } else if (_.isString(args[0])) {
////    config = {};
////    path = args[0];
////    toJoin = args.slice(1);
////  } else {
////    config = {};
////    path = null;
////    toJoin = [];
////  }
////
////  if (!path) { return ''; }
////
////  path = Path.join.apply(null, [path].concat(toJoin));
////
////  if (typeof config.startSlash != 'undefined') {
////
////    if (config.startSlash && !Path.isAbsolute(path)) {
////      path = Path.join('/', path);
////    }
////    if (!config.startSlash && Path.isAbsolute(path)) {
////      path = Path.relative('/', path);
////    }
////
////  }
////
////  if (typeof config.trailingSlash != 'undefined') {
////
////    if (config.trailingSlash && !isFile(path)) {
////      path += '/';
////    }
////    if (!config.trailingSlash) {
////      var lastChar = path.substr(path.length - 1);
////      if (lastChar == '/' || lastChar == '\/') {
////        path = path.substr(0, path.length - 1);
////      }
////    }
////
////  }
////
////  path = Path.normalize(path);
////
////  return path;
////};
////
/////**
//// *
//// * @param {String} sourceDir For example: 'app/scripts/plugins'
//// * @param {String} destDir For example: 'dist/js/plugins'
//// * @param {String} src For example: '*.js'
//// * @param {String} [watch] For example: '**\/*.js' (without backslash)
//// * @param {String|[]} [srcFilter] For example: ['*', '!_*]
//// * @param {String|[]} [watchFilter] For example: ['*', '!_*]
//// */
////var getConfig = function (sourceDir, destDir, src, watch, srcFilter, watchFilter) {
////  sourceDir = preparePath({startSlash: false, trailingSlash: false}, sourceDir);
////  destDir = preparePath({startSlash: false, trailingSlash: true}, destDir);
////
////  return {
////    src: Path.join(sourceDir, src),
////    dest: destDir,
////    watch: (watch) ? Path.join(sourceDir, watch) : false,
////    srcFilter: srcFilter || [],
////    watchFilter: watchFilter || []
////  };
////};
////
////var configTest = {
////  js: {
////    vendors: (function () {
////      var sourceDir = 'app/scripts/vendor';
////
////      return {
////        src: Path.join(sourceDir, '*.js'),
////        filter: [],
////        dest: 'dist/js/vendor/',
////        watch: Path.join(sourceDir, '*.js'),
////      };
////    })(),
////    plugins: getConfig('app/scripts/libs', 'dist/js/libs', '*.js', '**/*.js'),
////    app: getConfig('app/scripts/app', 'dist/js', '*.js', '**/*.js'),
////  }
////};
////
////
////
////Gulp.task('js:test', function () {
////  var filter = Filter(['*', '!_*', '!']);
////
////  //var src =
////  return Gulp.src(Path.join(getRelativePath(configTest.js.baseDir, configTest.js.src)))
////    .pipe(Plumber(Helpers.plumberErrorHandler))
////
////    .pipe(Tap(function (file) {
////      var filename = Path.basename(file.path);
////      console.log('before', filename);
////    }))
////
////    .pipe(Filter(function (file) {
////      var is = Is(file);
////      return !is.underscored;
////    }))
////
////    .pipe(Tap(function (file) {
////      var filename = Path.basename(file.path);
////      console.log('after', filename);
////    }))
////
////    //.pipe(gulpSourcemaps.init())
////    .pipe(FileInclude(config.FileInclude))
////    //.pipe(gulpSourcemaps.write('maps', {
////    //  includeContent: true,
////    //  sourceRoot: paths.src.js
////    //}))
////    .pipe(Gulp.dest(paths.dist.js));
////});
////
////Gulp.task('js:app', function () {
////  var filter = Filter(['*', '!_*']);
////  return Gulp.src(paths.src.js)
////    .pipe(Plumber(Helpers.plumberErrorHandler))
////
////    .pipe(Tap(function (file) {
////      var filename = Path.basename(file.path);
////      console.log('before', filename);
////    }))
////
////    //.pipe(Changed(paths.dist.js))
////    .pipe(Filter(function (file) {
////      var is = Is(file);
////      return !is.underscored;
////    }))
////
////    //.pipe(Filter(function (file) {
////    //  var is = Is(file);
////    //  return !is.underscored;
////    //}))
////
////    .pipe(Tap(function (file) {
////      var filename = Path.basename(file.path);
////      console.log('after', filename);
////    }))
////
////    //.pipe(gulpSourcemaps.init())
////    .pipe(FileInclude(config.FileInclude))
////    //.pipe(gulpSourcemaps.write('maps', {
////    //  includeContent: true,
////    //  sourceRoot: paths.src.js
////    //}))
////    .pipe(Gulp.dest(paths.dist.js));
////});
////Gulp.task('js:vendors', function() {
////  return Gulp.src(paths.src.jsVendors)
////    .pipe(Plumber(Helpers.plumberErrorHandler))
////    .pipe(Gulp.dest(paths.dist.jsVendors));
////});
////Gulp.task('js:polyfilly', function(cb) {
////  return Gulp.src(paths.dist.js +'/*.js')
////    .pipe(Plumber(Helpers.plumberErrorHandler))
////    .pipe(Filter(function (file) {
////      var is = Is(file);
////      return is.js && !is.minified;
////    }))
////    .pipe(Tap(function (file) {
////      var filePath = file.path;
////      var extname = Path.extname(filePath);
////      var filename = Path.basename(filePath);
////      var basename = Path.basename(filePath, extname);
////      var path = filePath.replace(new RegExp(basename + extname +'$'), '');
////      var polyfillsFileName = basename + '.polyfilled' + extname;
////
////      var FileStream = Gulp.src(file.path);
////      var polyfillsStream = FileStream.pipe(AutoPolyfiller(polyfillsFileName, config.AutoPolyfiller));
////      return Merge(FileStream, polyfillsStream)
////        .pipe(Order([
////          polyfillsFileName,
////          filename
////        ]))
////        .pipe(Concat(filename))
////        .pipe(Gulp.dest(path));
////    }));
////});
////Gulp.task('js:build', function (cb) {
////  RunSequence(['js:app', 'js:vendors'], cb);
////});
////Gulp.task('js:min', function () {
////  return Gulp.src(paths.dist.js +'/**/*.js')
////    .pipe(Plumber(Helpers.plumberErrorHandler))
////    .pipe(Filter(function (file) {
////      var is = Is(file);
////      return is.js && !is.minified;
////    }))
////    .pipe(Uglify())
////    .pipe(Rename(function (path) {
////      if (!path.basename.match(/\.min$/)) {
////        path.basename += '.min';
////      }
////    }))
////    .pipe(Gulp.dest(paths.dist.js));
////});
////Gulp.task('js:dist', function (cb) {
////  RunSequence(
////    'js:build',
////    'js:polyfilly',
////    'js:min',
////    cb
////  );
////});
////
////Gulp.task('sass:build', function () {
////  return Sass(paths.src.sass, {
////    //style: 'expanded',
////    //debugInfo: true,
////    sourcemap: true,
////    compass: true,
////    loadPath: [
////      paths.src.sass,
////      config.bower.src
////    ]
////  }).on('error', function (err) {
////    console.error(err);
////    //throw new Error (err);
////  })
////  .pipe(Sourcemaps.write('maps', {
////    includeContent: true,
////    sourceRoot: paths.src.sass
////  }))
////  .pipe(Gulp.dest(paths.dist.css))
////  .pipe(BrowserSync.reload({stream: true}));
////  // http://www.browsersync.io/docs/gulp/
////  //pipe(browserSync.stream({match: '**/*.css'}));
////});
////Gulp.task('css:build', function () {
////  return Gulp.src(paths.src.css)
////    .pipe(Plumber(Helpers.plumberErrorHandler))
////    //.pipe(Changed(paths.dist.css))
////    //.pipe(sourcemaps.init())
////    .pipe(Filter(function (file) {
////      var is = Is(file);
////      return !is.underscored;
////    }))
////    //.pipe(sourcemaps.write({
////    //  includeContent: false,
////    //  sourceRoot: paths.src.css
////    //}))
////    .pipe(FileInclude(config.FileInclude))
////    //.pipe(base64({
////    //  extensions: ['jpg', 'png'],
////    //  maxImageSize: 32*1024 // размер указывается в байтах, тут он 32кб потому, что больше уже плохо для IE8
////    //}))
////    .pipe(Gulp.dest(paths.dist.css))
////    .pipe(BrowserSync.reload({stream: true}));
////});
////Gulp.task('styles:critical:clean', function (cb) {
////  return RimRaf(paths.dist.criticalCss, cb);
////});
////Gulp.task('styles:critical:build', function (cb) {
////
////  //https://github.com/BrowserSync/browser-sync/blob/master/test/specs/instances/multi.proxy.js#L46
////  //https://github.com/BrowserSync/browser-sync/issues/816
////  return;
////
////  console.time('criticalCss');
////
////  if (!_.isArray(config.criticalCss.injectFiles)) {
////    config.criticalCss.injectFiles = [config.criticalCss.injectFiles];
////  }
////
////  var tearDown = function (ph, localServer) {
////    console.timeEnd('criticalCss');
////    ph && ph.exit();
////    localServer && localServer.exit();
////    cb();
////  };
////
////  Phantom.create(function (ph) {
////    ph.createPage(function (page) {
////      page.set('viewportSize', {
////        width: 1920,
////        height: 1080
////      });
////      page.set('settings.userAgent', 'Mozilla/5.0 (Windows NT 6.1; rv:39.0) Gecko/20100101 Firefox/39.0');
////      page.set('settings.loadImages', false);
////      page.set('settings.resourceTimeout', 10000);
////
////      var localServer = BrowserSync.create('CriticalCSS-'+ (new Date()).getTime());
////      //console.log(JSON.stringify(_.toArray(localServer)));
////      localServer.init(config.BrowserSyncDist, function () {
////        page.open("http://localhost:1313/index.html", function (status) {
////          if (status === "success") {
////            page.render(Path.join(__dirname, 'criticalcss/'+ (new Date).getTime() +'.png'));
////
////            _.forEach(config.criticalCss.injectFiles, function (script) {
////              script = Path.join(__dirname, script);
////              page.injectJs(script);
////            });
////
////            page.evaluate(function () {
////              return JSON.stringify(window.criticalCss || ['Хуй тебе']);
////            }, function (result) {
////              console.log(result);
////              tearDown(ph, localServer);
////            });
////          }
////        });
////      });
////    });
////  }, {
////    dnodeOpts: {
////      weak: false
////    },
////    //port: 1313,
////    //hostname: 'localhost',
////    path: config.phantomJsPath
////  });
////
/////*
////  var nm = new Nightmare({
////    timeout: 10000,
////    weak: false,
////    loadImages: true,
////    phantomPath: Config.phantomJsPath,
////    ignoreSslErrors: true,
////    webSecurity: false
////  });
////  nm.useragent('Mozilla/5.0 (Windows NT 6.1; rv:39.0) Gecko/20100101 Firefox/39.0');
////  nm.viewport(1920, 1080);
////  nm.on('loadFinished', function (status) {
////    //throw status;
////  });
////
////  var localServer = BrowserSync.create('CriticalCSS-'+ (new Date()).getTime());
////  localServer.init(Config.BrowserSyncDist, function () {
////    nm.goto('http://localhost:1313/index.tpl');
////    //nm.goto('http://localhost:1313/index.tpl');
////    //nm.goto('http://yandex.ru');
////    nm.wait();
////    //nm.screenshot('criticalcss/'+ (new Date).getTime() +'.png');
////
////    nm.url(function (url) {
////      nm.evaluate(function (NMUrl) {
////        window.NMUrl = NMUrl;
////
////        return NMUrl;
////      }, function (NMUrl) {
////        console.log('NMUrl', NMUrl);
////        if (Array.isArray(Config.criticalCss.injectFiles)) {
////          Config.criticalCss.injectFiles.forEach(function (file) {
////            nm.inject('js', file);
////          });
////        } else if (typeof Config.criticalCss.injectFiles == 'string') {
////          nm.inject('js', Config.criticalCss.injectFiles);
////        }
////        nm.evaluate(function () {
////          if (typeof window.criticalCss != 'undefined') {
////            return JSON.stringify(window.criticalCss);
////          }
////          return null;
////        }, function (result) {
////          console.log('result:', result && JSON.parse(result) || 'Error :(');
////        });
////      }, url);
////    });
////
////    nm.run(function (err) {
////      if (err) { throw new Error(err); }
////      console.log('Done.');
////      localServer.exit();
////    });
////
////  });
//////*/
////
////  Gulp.src(paths.dist.html +'*.html')
////    .pipe(Tap(function (file) {
////      var filename = Path.basename(file.path);
////      console.log(filename);
////      var content = file.contents;
////      //var styles = content.match(/<(style|link)( rel="stylesheet" type="text\/css"><\/\\1>/gm);
////        //console.log($('style, link[type$=css]'));
////    }));
////
////  //
////  //var parsePath = function (_path) {
////  //  var extname = path.extname(_path);
////  //  return {
////  //    path: _path,
////  //    dirname: path.dirname(_path),
////  //    basename: path.basename(_path, extname),
////  //    extname: extname
////  //  };
////  //};
////  //
////  ////var tmpDir = paths.dist.css;
////  //var tmpDir = require('os').tmpdir();
////  //// '+ (new Date).getTime() +'.
////  //var tmpFilename = 'critical.'+ (new Date).getTime() +'.css';
////  //var tmpCriticalCssFile = path.join(tmpDir, tmpFilename);
////  //var criticalCssFolder = path.resolve(path.join(__dirname, paths.dist.criticalCss));
////  //
////  //var unlinkTmpFile = function (needException) {
////  //  needException = (typeof needException != 'undefined') ? !!needException : false;
////  //  FS.unlink(tmpCriticalCssFile, (function (needException) {
////  //    return function (e) {
////  //      if (e && needException) {
////  //        throw new Error(e);
////  //      }
////  //      console.log('Temp file removed');
////  //    };
////  //  })(needException));
////  //};
////  //
////  //var stylesConcatDeferred = Q.defer();
////  //var notMinFilter = Filter(['*.css', '!*.min.css']);
////  //gulp.src(paths.dist.css +'*.css')
////  //    .pipe(gulpPlumber({errorHandler: function (e) {
////  //      stylesConcatDeferred.reject(e);
////  //    }}))
////  //    .pipe(notMinFilter)
////  //  //.pipe(tap(function (file,t) {
////  //  //  console.log(path.basename(file.path));
////  //  //}))
////  //    .pipe(gulpConcat(tmpFilename, {stat: {mode: '0666'}}))
////  //    .pipe(Csso())
////  //    .pipe(gulp.dest(tmpDir))
////  //    .pipe(Callback(function() {
////  //      stylesConcatDeferred.resolve();
////  //    }));
////  //
////  //return stylesConcatDeferred.promise.then(function () {
////  //  console.log('Temp file created');
////  //  var deferred = Q.defer();
////  //  CriticalCSS.getRules(tmpCriticalCssFile, function(err, output) {
////  //    setTimeout(function(){
////  //      if (err) {
////  //        deferred.reject(err);
////  //      } else {
////  //        MkPath(criticalCssFolder, '0755', function (err) {
////  //          if (err) {
////  //            deferred.reject(err);
////  //          } else {
////  //            FS.readdir(paths.dist.html, function (err, files) {
////  //              if (err) {
////  //                deferred.reject(err);
////  //              } else {
////  //                var htmlFiles = files.map(function (file) {
////  //                  var filePath = path.resolve(path.join(__dirname, paths.dist.html, file));
////  //                  return parsePath(filePath);
////  //                }).filter(function (File) {
////  //                  return (File.extname == '.html' || File.extname == '.htm');
////  //                });
////  //                var filesCount = htmlFiles.length;
////  //                var readyCount = 0;
////  //                var increment = function () {
////  //                  readyCount = readyCount + 1;
////  //                  if (readyCount == filesCount) {
////  //                    deferred.resolve();
////  //                  }
////  //                };
////  //                htmlFiles.forEach(function (File, index) {
////  //                  CriticalCSS.findCritical(File.path, {
////  //                    rules: JSON.parse(output),
////  //                    ignoreConsole: true
////  //                  }, (function (File, index) {
////  //                    return function (err, output) {
////  //                      if (err) {
////  //                        deferred.reject(err);
////  //                      } else {
////  //                        var criticalCssFilePath = path.join(criticalCssFolder, File.basename + '.css');
////  //                        FS.writeFile(criticalCssFilePath, output, {flag: 'w+'}, function (err) {
////  //                          if (err) {
////  //                            deferred.reject(err);
////  //                          } else {
////  //                            increment();
////  //                          }
////  //                        });
////  //                      }
////  //
////  //                    }
////  //                  })(File, index));
////  //                });
////  //              }
////  //            });
////  //          }
////  //        });
////  //      }
////  //    }, 0)
////  //  });
////  //
////  //  return deferred.promise.then(function () {
////  //    console.log('Criticals css created');
////  //    unlinkTmpFile(true);
////  //
////  //    var notMinFilter = Filter(['*.css', '!*.min.css']);
////  //    return gulp.src(paths.dist.criticalCss +'*.css')
////  //        .pipe(gulpPlumber(Helpers.plumberErrorHandler))
////  //      //.pipe(Count('## before filter'))
////  //        .pipe(notMinFilter)
////  //      //.pipe(Count('## after filter'))
////  //        .pipe(Csso())
////  //        .pipe(gulpTap(function (file,t) {
////  //          var File = parsePath(file.path);
////  //          var filename = File.basename +'.html';
////  //          var htmlFilePath = path.resolve(path.join(__dirname, paths.dist.html, filename));
////  //          FS.exists(htmlFilePath, function (exists) {
////  //            if (!exists) {
////  //              console.log('HTML file "'+ path.basename(file.path) +'" doesn\'t exists.');
////  //              return;
////  //            }
////  //            FS.readFile(htmlFilePath, {encoding: 'utf8'},
////  //                (function (htmlFilePath, filename, file) {
////  //                  return function (e, data) {
////  //                    if (e) {
////  //                      throw new Error(e);
////  //                    }
////  //                    var match = '<style>\/** critical css **\/';
////  //                    if (new RegExp(match, 'gm').test(data)) {
////  //                      data = data.replace(new RegExp('('+ match +')', 'gm'), '$1' + file.contents +
// '</style>');
////  //                    } else {
////  //                      data = data.replace(/([ \t]*)(<head[^>]*>)/, '$1$2\n$1  <style>/** critical css **/'+
//// file.contents + '</style>'); //                    } // //                    FS.writeFile(htmlFilePath, data,
//// (function (filename) { //                      return function(e) { //                        if (e) { //
////               throw new Error(e); //                        } //                        console.log('Critical CSS
//// injected to', filename); //                      }; //                    })(filename)); //                  } //
// // //                })(htmlFilePath, filename, file) //            ); //          }); //        })) // //
// .pipe(gulpRename(function (path) { //          path.basename += '.min'; //        })) // //
// .pipe(gulp.dest(paths.dist.criticalCss)); // //  }, function (e) { //    unlinkTmpFile(); //    handleError(e); //
// // }); //}, function (e) { //  handleError(e); //});  //*/ }); Gulp.task('styles:critical', function (cb) { return
// // RunSequence( 'styles:critical:clean', 'styles:critical:build', cb ); }); Gulp.task('styles:min', function () { //
// return Gulp.src(paths.dist.css +'/**/*.css') .pipe(Plumber(Helpers.plumberErrorHandler)) .pipe(Filter(function //
// (file) { var is = Is(file); return is.css && !is.minified; })) .pipe(Autoprefixer(config.Autoprefixer)) //
// .pipe(Csso()) .pipe(Rename(function (path) { if (!path.basename.match(/\.min$/)) { path.basename += '.min'; } })) //
// .pipe(Gulp.dest(paths.dist.css)); }); Gulp.task('styles:build', function (cb) { return RunSequence( ['sass:build',
// // 'css:build'], cb ); }); Gulp.task('styles:dist', function(cb) { return RunSequence( 'styles:build', //
// //'styles:critical', //'styles:min', 'styles:min', //'styles:critical', cb ); });  Gulp.task('images:content:build',
// // function () { return Gulp.src(paths.src.images.content) .pipe(Plumber(Helpers.plumberErrorHandler)) //
// .pipe(Cache('images:content:build')) .pipe(Gulp.dest(paths.dist.images.content)); }); //
// Gulp.task('images:design:build', function () { return Gulp.src(paths.src.images.inline) //
// .pipe(Plumber(Helpers.plumberErrorHandler)) .pipe(Cache('images:inline:build')) //
// .pipe(Gulp.dest(paths.dist.images.inline)); }); Gulp.task('images:build', function (cb) { return //
// RunSequence(['images:content:build', 'images:inline:build'], cb); }); Gulp.task('images:design:min', function () {
// // return Gulp.src(paths.dist.images.inline +'**/*.*') .pipe(Plumber(Helpers.plumberErrorHandler)) //
// .pipe(ImageMin(config.ImageMin)) .pipe(Gulp.dest(paths.dist.images.inline)); }); Gulp.task('images:content:min', //
// function () { return Gulp.src(paths.dist.images.content) .pipe(Plumber(Helpers.plumberErrorHandler)) //
// .pipe(ImageMin(config.ImageMin)) .pipe(Gulp.dest(paths.dist.images.content)); }); Gulp.task('images:min', function
// // (cb) { return RunSequence( ['images:content:min', 'images:inline:min'], cb ); }); Gulp.task('images:design:dist',
// // function (cb) { return RunSequence( 'images:design:build', 'images:design:min', cb ); }); //
// Gulp.task('images:content:dist', function (cb) { return RunSequence( 'images:content:build', 'images:content:min',
// // cb ); }); Gulp.task('images:dist', function (cb) { return RunSequence( ['images:content:dist', //
// 'images:design:dist'], cb ); });  Gulp.task('html:build', function () { return Gulp.src(paths.src.html)
// .pipe(Plumber(Helpers.plumberErrorHandler)) .pipe(FileInclude(config.FileInclude))
// .pipe(Gulp.dest(paths.dist.html)); }); Gulp.task('html:dist', function (cb) { return RunSequence('html:build', cb);
// });  Gulp.task('build', function (cb) { RunSequence( ['removeDist', 'clearCache'], ['copyroot', 'fonts:build',
// 'js:build', 'images:build'], 'styles:build', 'html:build', cb ); }); Gulp.task('dist', function (cb) { RunSequence(
// 'removeDist', ['copyroot', 'html:dist', 'js:dist', 'images:dist', 'fonts:dist'], 'styles:dist', cb ); });
// Gulp.task('server:start', function (cb) { return BrowserSync(config.BrowserSync, cb); }); Gulp.task('server:stop',
// function () { return BrowserSync.exit(); }); Gulp.task('watch', ['server:start'], function () {
// Gulp.watch(paths.watch.images.inline, ['images:inline:build'], BrowserSync.reload);
// Gulp.watch(paths.watch.images.content, ['images:content:build'], BrowserSync.reload); Gulp.watch(paths.watch.css,
// ['css:build'] //,BrowserSync.reload({stream: true}) ); Gulp.watch(paths.watch.sass, ['sass:build']
// //,BrowserSync.reload({stream: true}) ); Gulp.watch(paths.watch.js, ['js:build', BrowserSync.reload]);
// Gulp.watch(paths.watch.html, ['html:build', BrowserSync.reload]); Gulp.watch(paths.watch.root, ['copyroot',
// BrowserSync.reload]); Gulp.watch(paths.watch.fonts, ['fonts:build', BrowserSync.reload]); });  Gulp.task('default',
// function (cb) { RunSequence( 'removeDist', ['copyroot', 'fonts:build', 'js:build', 'images:build', 'html:build'],
// 'styles:build', ['server:start', 'watch'], cb ); });
