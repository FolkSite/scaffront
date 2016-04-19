var defaults = {
  src: 'app/jade',
  dest: {
    render: 'dist/html',
    data: 'dist/tpl/data',
    compile: 'dist/tpl/compile'
  },
  dataFileSuffix: '-data'
};


var Helpers = require('../../helpers/index.js');
var config = require('../config.js').jade;

var _ = require('lodash');
var Path = require('path');
var Gulp = require('gulp');
var Changed = require('gulp-changed');
var RunSequence = require('run-sequence').use(Gulp);
var Plumber = require('gulp-plumber');
var Uglify = require('gulp-uglify');
var Del = require('del');
var Extend = require('extend');
var Rename = require('gulp-rename');
var Tap = require('gulp-tap');

var GulpJadeInheritance = require('gulp-jade-inheritance');
var Preprocess = require('gulp-preprocess');
var GulpJade = require('gulp-jade');
var Jade = require('jade');
var JadeFilters = require('../../helpers/jade.filters.js');
var Data = require('gulp-data');
var Umd = require('gulp-umd');
var Gutil = require('gulp-util');

config = Extend(true, defaults, config);

config.src = Helpers.preparePath({trailingSlash: true}, config.src);
config.dest.render = Helpers.preparePath({trailingSlash: true}, config.dest.render);
config.dest.data = Helpers.preparePath({trailingSlash: true}, config.dest.data);
config.dest.compile = Helpers.preparePath({trailingSlash: true}, config.dest.compile);

Extend(Jade.filters, (_.isPlainObject(JadeFilters)) ? JadeFilters : {});


Gulp.task('jade:render', function () {

  return Gulp.src([config.src +'**/*.jade'])
    .pipe(Plumber(Helpers.plumberErrorHandler))
    .pipe(Preprocess())
    .pipe(Changed(config.dest.render, {extension: '.html'}))
    .pipe(GulpJadeInheritance({basedir: config.src}))
    .pipe(Data(Helpers.getDataForTpl(config.dataFileSuffix, '.js')))
    .pipe(GulpJade({
      jade: Jade,
      pretty: true
    }))
    .pipe(Gulp.dest(config.dest.render));
});

Gulp.task('jade:render:cleanup', function () {
  return Del([config.dest.render +'**/*.html']);
});


Gulp.task('jade:compile', function () {

  return Gulp.src([config.src +'**/*.jade'])
    .pipe(Plumber(Helpers.plumberErrorHandler))
    .pipe(Preprocess())
    .pipe(Changed(config.dest.compile, {extension: '.js'}))
    .pipe(Data(Helpers.getDataForTpl(config.dataFileSuffix, '.js')))
    .pipe(GulpJade({
      jade: Jade,
      pretty: false,
      client: true
    }))
    .pipe(Umd({
      exports: function(file) {
        return 'template';
      },
      namespace: function (file) {
        return 'templates.'+ Helpers.capitalize(Path.basename(Gutil.replaceExtension(file.path, '')));
      },
    }))
    .pipe(Gulp.dest(config.dest.compile));
});

Gulp.task('jade:compile:min', ['jade:compile'], function () {

  return Gulp.src([config.dest.compile +'**/*.js'])
    .pipe(Plumber(Helpers.plumberErrorHandler))
    .pipe(Changed(config.dest.compile, {extension: '.min.js'}))
    .pipe(Uglify())
    .pipe(Rename(function (path) {
      if (!path.basename.match(/\.min$/)) {
        path.basename += '.min';
      }
    }))
    .pipe(Gulp.dest(config.dest.compile));
});

Gulp.task('jade:compile:cleanup', function () {
  return Del([config.dest.compile +'**/*.js']);
});


Gulp.task('jade:data', function () {

  return Gulp.src(config.src +'**/*'+ config.dataFileSuffix +'.js')
    .pipe(Plumber(Helpers.plumberErrorHandler))
    .pipe(Preprocess())
    .pipe(Changed(config.dest.data, {extension: '.json'}))
    .pipe(Tap(function (file) {
      var data = require(file.path);

      if (_.isPlainObject(data)) {
        file.contents = new Buffer(JSON.stringify(data, null, 2), 'utf8');
      }
    }))
    .pipe(Rename({
      extname: '.json'
    }))
    .pipe(Gulp.dest(config.dest.data))
    .pipe(Gulp.dest(config.dest.render));
});

Gulp.task('jade:data:cleanup', function () {
  return Del([config.dest.data, config.dest.render].map(function (dest) { return dest +'**/*.json'; }));
});


Gulp.task('jade', ['jade:build']);
Gulp.task('jade:build', function (cb) {
  RunSequence(
    ['jade:render', 'jade:compile', 'jade:data'],
    cb
  );
});

Gulp.task('jade:dist', function (cb) {
  RunSequence(
    'jade:cleanup',
    ['jade:render', 'jade:compile:min', 'jade:data'],
    cb
  );
});


Gulp.task('jade:cleanup', ['jade:data:cleanup', 'jade:compile:cleanup', 'jade:render:cleanup'], function () {
  return Del([config.dest.data, config.dest.render, config.dest.compile]);
});


Gulp.task('jade:watch', function (cb) {
  //RunSequence(
  //  ['jade:render', 'jade:compile:min', 'jade:data'],
  //  cb
  //);

  cb();
});

