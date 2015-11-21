// http://habrahabr.ru/post/224825/
// https://makeomatic.ru/blog/2014/12/06/Tips_and_Tricks/
// http://frontender.info/gulp-browserify-starter-faq/


var Helpers = require('../../helpers/functions.js');
var config = require('../config.js').scripts;

var _ = require('lodash');
var Gulp = require('gulp');
var Changed = require('gulp-changed');
var RunSequence = require('run-sequence').use(Gulp);
var Plumber = require('gulp-plumber');
var Uglify = require('gulp-uglify');
var Del = require('del');
var Extend = require('extend');
var Rename = require('gulp-rename');
var Tap = require('gulp-tap');

var Lazypipe = require('lazypipe');
var Browserify = require('browserify');
var Watchify = require('watchify');
var isStream = require('isstream');
var VinylSourceStream = require('vinyl-source-stream');
var bowerConfig = require('../config.js').bower;


var defaults = {
  copy: {
    src: 'app/scripts/vendor',
    dest: 'dist/js/vendor'
  },
  build: {
    src: 'app/scripts',
    dest: 'dist/js'
  },
};

config = Extend(true, defaults, config);



//var resolve = require('resolve-bower');
//var res = resolve.sync('jquery', { basedir: Path.join(__dirname, 'app/scripts/bower_components') });

return;

/**
 * @param {string|{}} file
 * @param {string} [standalone]
 * @returns {*}
 */
var getPreBundle = function (file, standalone) {
  var args = _.toArray(arguments);
  var options = {};

  if (_.isPlainObject(args[0])) {
    file = '';
    standalone = false;
    options = args[0];
  }

  var defaults = {
    // это для sourcemaps
    cache: {}, packageCache: {}, fullPaths: !global.isProduction,
    // путь до end-point (app.js)
    entries: file,
    // если пишем модуль, то через этот параметр
    // browserify обернет всё в UMD-обертку
    // и при подключении объект будет доступен как bundle.global
    standalone: standalone,
    //extensions: config.extensions || '.js',
    debug: !global.isProduction
  };

  options = Extend(true, defaults, options);

  return browserify(options);
};

var buildStreams = Lazypipe();


gulp.task('scripts', function(cb) {

  // считаем кол-во бандлов
  var queue = config.bundles.length;

  // поскольку бандлов может быть несколько, оборачиваем сборщик в функцию,
  // которая в качестве аргумента принимает bundle-объект с параметрами
  // позже запустим её в цикл
  var buildThis = function(bundle) {

    var preBundle = getPreBundle(path);
    //isStream

    // отдаем preBundle browserify
    //var preBundle = browserify({
    //  // это для sourcemaps
    //  cache: {}, packageCache: {}, fullPaths: devBuild,
    //  // путь до end-point (app.js)
    //  entries: preBundle.src,
    //  // если пишем модуль, то через этот параметр
    //  // browserify обернет всё в UMD-обертку
    //  // и при подключении объект будет доступен как preBundle.global
    //  standalone: preBundle.global,
    //  // дополнительные расширения
    //  extensions: config.extensions,
    //  // пишем sourcemaps?
    //  debug: devBuild
    //});

    // сборка
    var build = function() {

      return (
        // browserify-сборка
        preBundle.bundle().pipe(buildStreams())
          // превращаем browserify-сборку в vinyl
          .pipe(VinylSourceStream())
          // эта штука нужна, чтобы нормально работал `require` собранной библиотеки
          .pipe(derequire())
          // если dev-окружение, то сохрани неминифицированную версию в `public/` (зачем - не помню))
          .pipe(gulpif(devBuild, gulp.dest(preBundle.destPublicDir)))
          // если сохраняем в папку `dist` - сохраняем
          .pipe(gulpif(preBundle.saveToDist, gulp.dest(preBundle.destDistDir)))
          // это для нормальной работы sourcemaps при минификации
          .pipe(gulpif(preBundle.compress, buffer()))
          // если dev-окружение и нужна минификация — инициализируем sourcemaps
          .pipe(gulpif(preBundle.compress && devBuild, sourcemaps.init({loadMaps: true})))
          // минифицируем
          .pipe(gulpif(preBundle.compress, uglify()))
          // к минифицированной версии добавляем суффикс `.min`
          .pipe(gulpif(preBundle.compress, rename({suffix: '.min'})))
          // если собираем для production - добавляем баннер с названием и версией релиза
          .pipe(gulpif(!devBuild, header(config.banner)))
          // пишем sourcemaps
          .pipe(gulpif(preBundle.compress && devBuild, sourcemaps.write('./')))
          // сохраняем минифицированную версию в `/dist`
          .pipe(gulpif(preBundle.saveToDist, gulp.dest(preBundle.destDistDir)))
          // и в `public`
          .pipe(gulp.dest(preBundle.destPublicDir))
          // в конце исполняем callback handleQueue (определен ниже)
          .on('end', handleQueue)
      );

    };

    // если нужны watchers
    if (global.isWatching) {
      // оборачиваем browserify-сборку в watchify
      preBundle = watchify(preBundle);
      // при обновлении файлов из сборки - пересобираем бандл
      preBundle.on('update', build);
    }

    // в конце сборки бандла
    var handleQueue = function () {
      Helpers.notify(destFile);
      // если есть очередь
      if (queue) {
        // уменьшаем на 1
        queue--;
        // если бандлов больше нет, то сообщаем, что таск завершен
        if (queue === 0) cb();
      }
    };

    return build();
  };

  // запускаем массив бандлов в цикл
  config.bundles.forEach(buildThis);

});







var sourceFile = './js/main.js',
    destFolder = './js/',
    destFile = 'findem.js';

gulp.task('browserify', function() {
  return browserify(sourceFile)
    .bundle()
    //.bundle({debug:true}) // sourcemaps
    .pipe(source(destFile))
    .pipe(gulp.dest(destFolder));
});

gulp.task('watch', function() {
  var bundler = watchify(sourceFile);

  var rebundle = function() {
    return bundler.bundle()
      //.bundle({debug:true}) // sourcemaps
      .pipe(source(destFile))
      .pipe(gulp.dest(destFolder));
  };

  bundler.on('update', rebundle);

  return rebundle();
});
