'use strict';

const _              = require('lodash');
const __             = require('./helpers');
const $              = require('gulp-load-plugins')();
const gulp           = require('gulp');
const del            = require('del');
const path           = require('path');
const merge          = require('merge-stream');
const isUrl          = require('is-url');
const extend         = require('extend');
const postcss        = require('postcss');
const combiner       = require('stream-combiner2').obj;
const resolve        = require('resolve');

const config         = require('../scaffront.config.js');
const streams        = require('./streams');

/**
 * @param {string} filePath
 * @param {string} baseDir
 * @param {string} targetDir
 * @returns {string}
 */
var resolveTargetFile = function resolveTargetFile (filePath, baseDir, targetDir) {
  filePath  = __.preparePath(filePath, {startSlash: true, trailingSlash: false});
  baseDir   = __.preparePath(baseDir, {startSlash: true, trailingSlash: true});
  targetDir = __.preparePath(targetDir, {startSlash: true, trailingSlash: true});

  var parsedFilePath        = __.parsePath(filePath);
  var fileName              = parsedFilePath.base;
  var fileDirWithoutBaseDir = path.relative(baseDir, parsedFilePath.dir);
  var targetFile            = path.join(targetDir, fileDirWithoutBaseDir, fileName);

  return targetFile;
};

/**
 * @param {string} filepath
 * @param {string} baseDir
 * @param {string} targetDir
 * @param {string} [cacheKey]
 */
var onUnlink = function onUnlink (filepath, baseDir, targetDir, cacheKey) {
  var file = path.resolve(filepath);
  if (cacheKey && $.cached.caches[cacheKey]) {
    delete $.cached.caches[cacheKey][file];
  }

  file = resolveTargetFile(filepath, config.tasks.files.root, config.tasks.dest);
  file = path.join(process.cwd(), file);
  del.sync(file, {read: false});
};

if (config.env.isDev) {
  require('trace');
  require('clarify');
}

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
gulp.task('files', function () {
  return combiner(
    gulp.src(config.tasks.files.src, {
      // При повторном запуске таска (например, через watch) выбирает только те файлы,
      // которые изменились с заданной даты (сравнивает по дате модификации mtime)
      //since: gulp.lastRun(options.taskName)
    }),
    //$.tap(function (file) {
    //  console.log('file', file.path);
    //})
    // При повторном запуске таска выбирает только те файлы, которые изменились с прошлого запуска (сравнивает по
    // названию файла и содержимому) $.cached - это замена since, но since быстрее, потому что ему не нужно полностью
    // читать файл. Но since криво работает с ранее удалёнными и только что восстановленными через ctrl+z файлами.
    $.cached('files'),

    // $.newer сравнивает проходящие через него файлы с файлами в _целевой_ директории и,
    // если в целевой директории такие файлы уже есть, то не пропускает их.
    // по логике, since работает после второго запуска, а $.newer сразу же, при первом.
    // у $.newer'а можно замапить сравнение исходных файлов с целевыми.
    $.newer(config.tasks.files.dest),
    $.if(config.env.isDev, $.debug({title: 'File:'})),

    gulp.dest(config.tasks.files.dest)
  ).on('error', $.notify.onError(err => ({
    title: 'Copy files',
    message: err.message
  })));
});

gulp.task('files:watch', function () {
  gulp
    .watch(config.tasks.files.watch, gulp.series('files'))
    .on('unlink', function (filepath) {
      onUnlink(filepath, config.tasks.files.root, config.tasks.dest, 'files');
    })
  ;
});

gulp.task('files:clean', function () {
  return del(config.tasks.files.clean, {read: false});
});
/** ========== //FILES ========== **/

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
 require('postcss-browser-reporter')({
  selector: 'html:before'
 }),


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
      cascade:  false,
      remove:   true
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


gulp.task('styles:css', function () {
  var smOpts = {
    sourceRoot: '/css/sources',
    includeContent: true,
  };

  return gulp
    .src(config.tasks.styles.css.src, {
      //since: gulp.lastRun(options.taskName)
    })
    // todo: инкрементальность
    .pipe($.plumber({
      errorHandler: $.notify.onError(err => ({
        title:   'CSS',
        message: err.message
      }))
    }))
    .pipe(streams.styles.css({
      postcss: [
        //require('postcss-copy-assets')({
        //  base: config.tasks.styles.dest
        //})
        // todo: резолвинг url'ов, копирование файлов
        // todo: минификация, спрайты, минификация изображений, svg, шрифты, фоллбеки, полифиллы
      ]
    }))
    .pipe($.if(config.env.isDev, $.debug({title: 'CSS:'})))
    .pipe($.if(
      config.env.isProd,
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
  //  // (это может произойти, если перед ним установлен since/$.cached/$.newer - они пропускают только изменённые
  // файлы, // исключая из gulp.src не изменившееся). но если какой-то файл из src-потока удалён с диска, то $.remember
  // // всё-равно будет его восстанавливать. для избежания подобного поведения, в watch-таске заставляем $.remember //
  // забыть об удалённых файлах. $.remember('css'), // инклюдим файлы // $.include(), // При повторном запуске таска
  // выбирает только те файлы, которые изменились с прошлого запуска (сравнивает по // названию файла и содержимому) //
  // $.cached - это замена since, но since быстрее, потому что ему не нужно полностью // читать файл. Ещё since криво
  // работает с ранее удалёнными и только что восстановленными через ctrl+z файлами. $.cached('css'),
  // $.if(config.env.isDev, $.debug({title: 'CSS style:'})), postCssTasksForCss, gulp.dest(options.dist) ).on('error',
  // $.notify.onError(err => ({ title: 'CSS styles', message: err.message })));
});

gulp.task('styles:scss', function () {
  var smOpts = {
    sourceRoot: '/css/sources',
    includeContent: true,
  };

  return gulp
    .src(config.tasks.styles.scss.src, {
      //since: gulp.lastRun(options.taskName)
    })
    //.pipe($.if(config.env.isDev, $.debug({title: 'Run SCSS:'})))
    .pipe($.plumber({
      errorHandler: $.notify.onError(err => ({
        title:   'SCSS',
        message: err.message
      }))
    }))
    .pipe(streams.styles.scss())
    .pipe($.if(config.env.isDev, $.debug({title: 'SCSS:'})))
    .pipe($.if(
      config.env.isProd,
      $.sourcemaps.write('.', smOpts), // во внешний файл
      $.sourcemaps.write('', smOpts) // инлайн
    ))
    .pipe(gulp.dest(config.tasks.styles.dest))
  ;
});

gulp.task('styles:watch', function () {
  gulp
    .watch(config.tasks.styles.css.watch, gulp.series('styles:css'))
    .on('unlink', function (filepath) {
      onUnlink(filepath, config.tasks.styles.root, config.tasks.styles.dest, 'css');
    })
  ;
  gulp
    .watch(config.tasks.styles.scss.watch, gulp.series('styles:scss'))
    .on('unlink', function (filepath) {
      onUnlink(filepath, config.tasks.styles.root, config.tasks.styles.dest, 'css');
    })
  ;

});

gulp.task('styles', gulp.series(
  gulp.parallel('styles:css', 'styles:scss')
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

