//'use strict';

var gulp = require('gulp'),
    q = require('q'),
    changed = require('gulp-changed'),
    count = require('gulp-count'),
    tap = require('gulp-tap'),
    callback = require('gulp-callback'),
    watch = require('gulp-watch'),
    filter = require('gulp-filter'),
    plumber = require('gulp-plumber'),
    concat = require('gulp-concat'),
    autoprefixer = require('gulp-autoprefixer'),
    //sass = require('gulp-sass'),
    sass = require('gulp-ruby-sass'),
    rename = require('gulp-rename'),
    sourcemaps = require('gulp-sourcemaps'),
    rigger = require('gulp-rigger'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    rimraf = require('rimraf'),
    opn = require('opn'),
    csso = require('gulp-csso'),
    uglify = require('gulp-uglify'),
    //closureCompiler = require('gulp-closure-compiler'),
    autopolyfiller = require('gulp-autopolyfiller'),
    cache = require('gulp-cached'),
    clean = require('gulp-clean'),
    runSequence = require('run-sequence'),
    browserSync = require('browser-sync'),
    path = require('path'),
    criticalcss = require('criticalcss'),
    mkpath = require('mkpath'),
    fs = require('fs');

var paths = {
  dist: {
    html: 'dist/',
    js: 'dist/js/',
    jsVendors: 'dist/js/vendor/',
    jsPolyfillsFilename: 'polyfills.js',
    css: 'dist/css/',
    criticalStyles: 'dist/css/criticals/',
    images: {
      inline: 'dist/i/',
      content: 'dist/images/'
    },
    fonts: 'dist/css/fonts/'
  },
  src: {
    html: 'app/html/*.html',
    root: 'app/root/**/*.*',
    js: 'app/js/*.js',
    jsVendors: 'app/js/vendor/*.js',
    //css: 'app/css/*.(scss|sass)',
    css: 'app/styles/',
    sass: 'app/styles/',
    images: {
      inline: 'app/img/inline/**/*.*',
      content: 'app/img/content/**/*.*'
    },
    fonts: 'app/fonts/**/*.*'
  },
  watch: {
    root: 'app/root/**/*.*',
    html: 'app/html/**/*.html',
    js: 'app/js/**/*.js',
    css: 'app/styles/**/*.css',
    sass: 'app/styles/**/*.@(scss|sass)',
    images: {
      inline: 'app/img/inline/**/*.*',
      content: 'app/img/content/**/*.*'
    },
    fonts: 'app/fonts/**/*.*'
  },
  clean: 'dist',
  closureCompiler: 'compiler.jar'
};

function handleError(e) {
  console.log(e.toString());
  this.emit('end');
}
var replaceDistPath = function (filepath) {
  var index = filepath.indexOf(paths.dist.html);
  if (index === 0 || index === 1) {
    return filepath.substr(index + paths.dist.html.length - 1);
  }
  return filepath;
};

gulp.task('removeDist', function (callback) {
  rimraf(paths.clean, callback);
});
gulp.task('copyroot', function () {
  gulp.src(paths.src.root)
    .pipe(plumber({errorHandler: handleError}))
    .pipe(gulp.dest(paths.dist.html));
});

gulp.task('fonts:build', function () {
  gulp.src(paths.src.fonts)
    .pipe(gulp.dest(paths.dist.fonts));
});
gulp.task('fonts:dist', ['fonts:build']);

gulp.task('js:app', function () {
  return gulp.src(paths.src.js)
    .pipe(plumber({errorHandler: handleError}))
    //.pipe(changed(paths.dist.js))
    //.pipe(count('## css'))
    .pipe(rigger())
    //.pipe(count('## css handled'))
    .pipe(gulp.dest(paths.dist.js));
});
gulp.task('js:vendors', function() {
  return gulp.src(paths.src.jsVendors)
    .pipe(plumber({errorHandler: handleError}))
    .pipe(gulp.dest(paths.dist.jsVendors));
});
gulp.task('js:polyfills', function() {
  return gulp.src(paths.dist.js +'*!(.min).js')
    .pipe(plumber({errorHandler: handleError}))
    .pipe(autopolyfiller(paths.dist.jsPolyfillsFilename, {
      browsers: ['last 3 version', 'ie 8', 'ie 9']
    }))
    .pipe(gulp.dest(paths.dist.js));
});
gulp.task('js:build', ['js:app', 'js:vendors']);
gulp.task('js:min', /*['js:build'], */function () {
  var notMinFilter = filter(['*.js', '!*.min.js']);
  return gulp.src(paths.dist.js +'**/*.js')
    .pipe(plumber({errorHandler: handleError}))
    .pipe(notMinFilter)
    //.pipe(tap(function (file,t) {
    //  console.log(path.basename(file.path));
    //}))
    .pipe(uglify())
    .pipe(rename(function (path) {
      if (!path.basename.match(/\.min$/)) {
        path.basename += '.min';
      }
    }))
    .pipe(gulp.dest(paths.dist.js));
});
gulp.task('js:dist', function() {
  runSequence(
    ['js:app', 'js:vendors'],
    'js:polyfills',
    'js:min'
  );
});

gulp.task('sass:build', function () {
  return sass(paths.src.sass, {
    style: 'expanded',
    //debugInfo: true,
    //sourcemap: true,
    compass: true
  }).on('error', function (err) {
    console.error(err);
    //throw new Error (err);
  })
  //.pipe(sourcemaps.write({
  //  includeContent: false,
  //  sourceRoot: paths.src.sass
  //}))
  .pipe(gulp.dest(paths.dist.css))
  .pipe(browserSync.reload({stream: true}));
});
gulp.task('css:build', function () {
  var filterCss = filter('[^_]*.css');
  return gulp.src(paths.src.css +'**/*.css')
    .pipe(plumber({errorHandler: handleError}))
    //.pipe(changed(paths.dist.css))
    //.pipe(count('## css'))
    //.pipe(sourcemaps.init())
    .pipe(filterCss)
    //.pipe(sourcemaps.write({
    //  includeContent: false,
    //  sourceRoot: paths.src.css
    //}))
    .pipe(rigger())
    //.pipe(base64({
    //  extensions: ['jpg', 'png'],
    //  maxImageSize: 32*1024 // размер указывается в байтах, тут он 32кб потому и больше уже плохо для IE8
    //}))
    //.pipe(count('## css handled'))
    .pipe(gulp.dest(paths.dist.css))
    .pipe(browserSync.reload({stream: true}));

});
gulp.task('styles:critical:clean', function (callback) {
  return rimraf(paths.dist.criticalStyles, callback);
});
gulp.task('styles:critical:build', function() {
  var parsePath = function (_path) {
    var extname = path.extname(_path);
    return {
      path: _path,
      dirname: path.dirname(_path),
      basename: path.basename(_path, extname),
      extname: extname
    };
  };

  //var tmpDir = paths.dist.css;
  var tmpDir = require('os').tmpdir();
  // '+ (new Date).getTime() +'.
  var tmpFilename = 'critical.'+ (new Date).getTime() +'.css';
  var tmpCriticalCssFile = path.join(tmpDir, tmpFilename);
  var criticalCssFolder = path.resolve(path.join(__dirname, paths.dist.criticalStyles));

  var unlinkTmpFile = function (needException) {
    needException = (typeof needException != 'undefined') ? !!needException : false;
    fs.unlink(tmpCriticalCssFile, (function (needException) {
      return function (e) {
        if (e && needException) {
          throw new Error(e);
        }
        console.log('Temp file removed');
      };
    })(needException));
  };

  var stylesConcatDeferred = q.defer();
  var notMinFilter = filter(['*.css', '!*.min.css']);
  gulp.src(paths.dist.css +'*.css')
      .pipe(plumber({errorHandler: function (e) {
        stylesConcatDeferred.reject(e);
      }}))
      .pipe(notMinFilter)
    //.pipe(tap(function (file,t) {
    //  console.log(path.basename(file.path));
    //}))
      .pipe(concat(tmpFilename, {stat: {mode: '0666'}}))
      .pipe(csso())
      .pipe(gulp.dest(tmpDir))
      .pipe(callback(function() {
        stylesConcatDeferred.resolve();
      }));

  stylesConcatDeferred.promise.then(function () {
    console.log('Temp file created');
    var deferred = q.defer();
    criticalcss.getRules(tmpCriticalCssFile, function(err, output) {
      setTimeout(function(){
        if (err) {
          deferred.reject(err);
        } else {
          mkpath(criticalCssFolder, '0755', function (err) {
            if (err) {
              deferred.reject(err);
            } else {
              fs.readdir(paths.dist.html, function (err, files) {
                if (err) {
                  deferred.reject(err);
                } else {
                  var htmlFiles = files.map(function (file) {
                    var filePath = path.resolve(path.join(__dirname, paths.dist.html, file));
                    return parsePath(filePath);
                  }).filter(function (File) {
                    return (File.extname == '.html' || File.extname == '.htm');
                  });
                  var filesCount = htmlFiles.length;
                  var readyCount = 0;
                  var increment = function () {
                    readyCount = readyCount + 1;
                    if (readyCount == filesCount) {
                      deferred.resolve();
                    }
                  };
                  htmlFiles.forEach(function (File, index) {
                    criticalcss.findCritical(File.path, {
                      rules: JSON.parse(output)
                    }, (function (File, index) {
                      return function (err, output) {
                        if (err) {
                          deferred.reject(err);
                        } else {
                          var criticalCssFilePath = path.join(criticalCssFolder, File.basename + '.css');
                          fs.writeFile(criticalCssFilePath, output, {flag: 'w+'}, function (err) {
                            if (err) {
                              deferred.reject(err);
                            } else {
                              increment();
                            }
                          });
                        }

                      }
                    })(File, index));
                  });
                }
              });
            }
          });
        }
      }, 0)
    });

    deferred.promise.then(function () {
      console.log('Criticals css created');
      unlinkTmpFile(true);

      var notMinFilter = filter(['*.css', '!*.min.css']);
      return gulp.src(paths.dist.criticalStyles +'*.css')
          .pipe(plumber({errorHandler: handleError}))
        //.pipe(count('## before filter'))
          .pipe(notMinFilter)
        //.pipe(count('## after filter'))
          .pipe(csso())
          .pipe(tap(function (file,t) {
            var File = parsePath(file.path);
            var filename = File.basename +'.html';
            var htmlFilePath = path.resolve(path.join(__dirname, paths.dist.html, filename));
            fs.exists(htmlFilePath, function (exists) {
              if (!exists) {
                console.log('HTML file "'+ path.basename(file.path) +'" doesn\'t exists.');
                return;
              }
              fs.readFile(htmlFilePath, {encoding: 'utf8'},
                  (function (htmlFilePath, filename, file) {
                    return function (e, data) {
                      if (e) {
                        throw new Error(e);
                      }
                      var match = '<style>\/\\*\\* critical css \\*\\*\/';
                      if (new RegExp(match, 'gm').test(data)) {
                        data = data.replace(new RegExp('('+ match +')', 'gm'), '$1' + file.contents + '</style>');
                      } else {
                        data = data.replace(/([ \t]*)(<head[^>]*>)/, '$1$2\n$1  <style>/** critical css **/'+ file.contents + '</style>');
                      }

                      fs.writeFile(htmlFilePath, data, (function (filename) {
                        return function(e) {
                          if (e) {
                            throw new Error(e);
                          }
                          console.log('Critical CSS injected to', filename);
                        };
                      })(filename));
                    }

                  })(htmlFilePath, filename, file)
              );
            });
          }))
          .pipe(rename(function (path) {
            path.basename += '.min';
          }))
          .pipe(gulp.dest(paths.dist.criticalStyles));

    }, function (e) {
      unlinkTmpFile();
      throw new Error(e);
    });
  }, function (e) {
    handleError(e);
  });

  //*/
});
gulp.task('styles:critical', function () {
  return runSequence(
    'styles:critical:clean',
    'styles:critical:build'
  );
});
gulp.task('styles:min', function () {
  var notMinFilter = filter(['*.css', '!*.min.css']);
  return gulp.src(paths.dist.css +'*.css')
      .pipe(plumber({errorHandler: handleError}))
      .pipe(notMinFilter)
    //.pipe(tap(function (file,t) {
    //  console.log(path.basename(file.path));
    //}))
      .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
      .pipe(csso())
      .pipe(rename(function (path) {
        if (!path.basename.match(/\.min$/)) {
          path.basename += '.min';
        }
      }))
      .pipe(gulp.dest(paths.dist.css));
});
gulp.task('styles:build', function() {
  return gulp.start('sass:build', 'css:build');
});
gulp.task('styles:dist', function() {
  return runSequence(
    ['sass:build', 'css:build'],
    ['styles:min', 'styles:critical']
    //'styles:critical:build'
  );

  //return gulp.start('styles:min', 'styles:critical');
});

gulp.task('images:content:build', function () {
  return gulp.src(paths.src.images.content)
    .pipe(plumber({errorHandler: handleError}))
    .pipe(cache('images:content:build'))
    //.pipe(count('## content images files changed'))
    .pipe(gulp.dest(paths.dist.images.content));
});
gulp.task('images:inline:build', function () {
  return gulp.src(paths.src.images.inline)
    .pipe(plumber({errorHandler: handleError}))
    .pipe(cache('images:inline:build'))
    //.pipe(count('## inline images files changed'))
    .pipe(gulp.dest(paths.dist.images.inline));
});
gulp.task('images:build', ['images:content:build', 'images:inline:build']);
gulp.task('images:inline:min', function () {
  return gulp.src(paths.dist.images.inline +'**/*.*')
    .pipe(plumber({errorHandler: handleError}))
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant({
        quality: '80-90',
        speed: 4
      })],
      interlaced: true
    }))
    .pipe(gulp.dest(paths.dist.images.inline));
});
gulp.task('images:content:min', function () {
  return gulp.src(paths.dist.images.content +'**/*.*')
    .pipe(plumber({errorHandler: handleError}))
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant({
        quality: '80-90',
        speed: 4
      })],
      interlaced: true
    }))
    .pipe(gulp.dest(paths.dist.images.content));
});
gulp.task('images:min', ['images:content:min', 'images:inline:min']);
gulp.task('images:inline:dist', ['images:inline:build'], function() {
  return gulp.start('images:inline:min');
});
gulp.task('images:content:dist', ['images:content:build'], function() {
  return gulp.start('images:content:min');
});
gulp.task('images:dist', ['images:content:dist', 'images:inline:dist']);

gulp.task('html:build', function () {
  return gulp.src(paths.src.html)
    .pipe(plumber({errorHandler: handleError}))
    .pipe(rigger())
    .pipe(gulp.dest(paths.dist.html));
});
gulp.task('html:dist', ['html:build']);

gulp.task('build', function() {
  runSequence(
    ['removeDist', 'clearCache'],
    ['copyroot', 'fonts:build', 'js:build', 'styles:build', 'images:build'],
    'html:build'
  );
});
gulp.task('dist', ['removeDist'], function() {
  return gulp.start('copyroot', 'html:dist', 'js:dist', 'styles:dist', 'images:dist', 'fonts:dist');
});

gulp.task('server', function() {
  return browserSync({
    port: 666,
    server: {
      baseDir: 'dist'
    }
  });
});
gulp.task('watch', ['server'], function() {
  gulp.watch(paths.watch.images.inline, ['images:inline:build'], browserSync.reload);
  gulp.watch(paths.watch.images.content, ['images:content:build'], browserSync.reload);
  gulp.watch(paths.watch.css, ['css:build'], browserSync.reload({stream: true}));
  gulp.watch(paths.watch.sass, ['sass:build'], browserSync.reload({stream: true}));
  gulp.watch(paths.watch.js, ['js:build', browserSync.reload]);
  gulp.watch(paths.watch.html, ['html:build', browserSync.reload]);
  gulp.watch(paths.watch.root, ['copyroot', browserSync.reload]);
  gulp.watch(paths.watch.fonts, ['fonts:build', browserSync.reload]);
});

gulp.task('default', function() {
  runSequence(
    // build task
    ['removeDist'],
    ['copyroot', 'fonts:build', 'js:build', 'styles:build', 'images:build'],
    'html:build',
    // server & watch
    ['server', 'watch']
  );
});



//gulp.task('default', function () {
//
//});