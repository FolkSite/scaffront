var _                 = require('lodash'),
    __                = require('../helpers/index'),
    extend            = require('extend'),
    path              = require('path'),
    gulp              = require('gulp'),
    gulpUtil          = require('gulp-util'),
    gulpTap           = require('gulp-tap'),
    mergeStreams      = require('event-stream').merge,
    lazypipe          = require('lazypipe'),
    del               = require('del'),
    gulpIf            = require('gulp-if'),
    getObject         = require('getobject'),
    gulpDerequire     = require('gulp-derequire'),
    browserify        = require('browserify'),
    watchify          = require('watchify'),
    vinylSourceStream = require('vinyl-source-stream'),
    vinylBuffer       = require('vinyl-buffer'),
    fontMin           = require('fontmin')
    //gulpFontMin       = require('gulp-fontmin')
  ;

var _config      = require('../_config'),
    tmpPath      = _config.tmpPath,
    Config       = _config.fonts,
    ServerConfig = _config.server;


gulp.task('fonts:asis', function (cb) {
  return __.getGulpSrc(__.getGlobPaths(Config.asis.src, Config.asis.exts || []))
    .pipe(gulp.dest(Config.asis.dest))
  ;
});

gulp.task('fonts:asis:cleanup', function (cb) {
  return del(__.getGlobPaths(Config.asis.dest, Config.asis.exts || []));
});


gulp.task('fonts:tocss:convert', function (cb) {
  if (!Config.tocss.convert) {
    cb();
    return;
  }

  Config.tocss.convert = (_.isArray(Config.tocss.convert)) ? Config.tocss.convert : [Config.tocss.convert];

  var convertQueue = [];

  _.each(Config.tocss.convert, function (convert) {
    if (!getObject.get(convert, 'from')) { return; }
    if (!getObject.get(convert, 'to')) { return; }

    convert.from = (_.isArray(convert.from)) ? convert.from : [convert.from];
    convert.to   = (_.isArray(convert.to))   ? convert.to   : [convert.to];

    var options = (_.isPlainObject(options)) ? convert.options : {};

    _.each(convert.from, function (from) {
      _.each(convert.to, function (to) {
        if (!fontMin[from +'2'+ to]) { return; }

        convertQueue.push({
          from: from,
          to: to,
          options: options
        });
      });
    });
  });

  var fontmin = new fontMin();
  _.each(convertQueue, function (convert) {
    //console.log('Config.tocss.src', Config.tocss.src);
    //console.log('convert', convert);

    var src = __.getGlobPaths(Config.tocss.src, convert.from);

    console.log('src', src);

    //gulp.src(src)
    //  .pipe(gulpTap(function (file) {
    //    console.log('tap file', file);
    //  }));
    //
    //return;

    fontmin.src(src[0])
      .use(fontMin[convert.from +'2'+ convert.to](convert.options));

    fontmin.run(function (err, files) {
      //console.log('err', err);
      console.log('files', files);

      return;

      files.forEach(function (file, index) {

        console.log('file.isNull()', file.isNull());
        console.log('file.isBuffer()', file.isBuffer());
        console.log('file.isStream()', file.isStream());

        file
          .pipe(vinylSourceStream('tmp'))
          .pipe(gulpTap(function () {
            console.log('arguments', arguments);
          }))
          .pipe(vinylBuffer())
          .pipe(gulp.dest(tmpPath));
      });

    });
  });

  //tmpPath

  return __.getGulpSrc(__.getGlobPaths(Config.tocss.src, Config.tocss.exts || []))
    .pipe(gulp.dest(Config.tocss.dest))
  ;
});

gulp.task('fonts:tocss', function (cb) {

  mergeStreams();

  return __.getGulpSrc(__.getGlobPaths(Config.tocss.src, Config.tocss.exts || []))
    .pipe(gulp.dest(Config.tocss.dest))
  ;
});

gulp.task('fonts:tocss:cleanup', function (cb) {



  var exts = false;
  if (_.isArray(Config.tocss.exts) && Config.tocss.exts.length) {
    exts = [];
    _.each(Config.tocss.exts, function (ext) {
      exts.push(
        ext +'.css',
        ext +'.min.css'
      );
    });
  }

  return del(__.getGlobPaths(Config.tocss.dest, exts));
});





