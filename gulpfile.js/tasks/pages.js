// https://github.com/osscafe/gulp-cheatsheet/blob/master/examples/js/stream-array.js

var _                = require('lodash'),
    __               = require('../helpers'),
    extend           = require('extend'),
    path             = require('path'),
    gulp             = require('gulp'),
    gulpUtil         = require('gulp-util'),
    gulpTap          = require('gulp-tap'),
    del              = require('del'),
    getObject        = require('getobject'),
    gulpChanged      = require('gulp-changed'),
    gulpData         = require('gulp-data'),
    runSequence      = require('run-sequence').use(gulp),
    gulpConsolidate  = require('gulp.consolidate'),
    gulpJsBeautifier = require('gulp-jsbeautifier'),
    gulpRename       = require('gulp-rename'),
    gulpPlumber      = require('gulp-plumber')
    //gulpUmd          = require('gulp-umd')
  ;

var server       = null,
    config       = require('../config'),
    pagesConfig  = config.pages.config,
    pagesUtils   = config.pages.utils,
    copierUtils  = config.copier.utils,
    serverConfig = config.server.config,
    serverUtils  = config.server.utils;


gulp.task('pages:copier', function () {
  var stream = copierUtils.copy(getObject.get(pagesConfig, 'copier'));

  if (typeof stream != 'undefined') {
    server && serverUtils.reloadServer(serverConfig.devServerName);
  }

  return stream;
});

gulp.task('pages:copier:cleanup', function () {
  return copierUtils.cleanup(getObject.get(pagesConfig, 'copier'));
});

gulp.task('pages:compile', function () {
  var stream = gulp.src(__.getGlobPaths(pagesConfig.src, pagesConfig.extnames, true))
    .pipe(gulpPlumber(__.plumberErrorHandler))
      .pipe(gulpData(pagesUtils.getTplData))
      .pipe(gulpConsolidate('swig', extend(true, {}, pagesConfig.tplsData || {}, {cache: false}), {
        setupEngine: function (engineName, instance) {
          var lodashMethods = ['isArray', 'isPlainObject', 'size'];
          _.each(lodashMethods, function (method) {
            instance.setFilter(method, _[method]);
          });

          instance.setFilter('toString', function (content) {
            var result = '';
            try {
              result = JSON.stringify(content);
              result = result || '';
            } catch (e) {
              result = (!_.isUndefined(content['toString'])) ? content.toString() : '';
            }

            return result;
          });

          instance.setFilter('defaults', function (input, defaults) {
            input = (_.isPlainObject(input)) ? input : {};
            defaults = (_.isPlainObject(defaults)) ? defaults : {};
            return extend(true, {}, defaults, input);
          });

          return instance;
        }
      }))
      .pipe(gulpRename({extname: '.html'}))
      .pipe(gulpJsBeautifier({
        html: {
          braceStyle: 'collapse',
          endWithNewline: true,
          indentInnerHtml: true,
          indentChar: ' ',
          indentScripts: 'normal',
          indentSize: 2,
          maxPreserveNewlines: 1,
          preserveNewlines: false,
          unformatted: ['a', 'sub', 'sup', 'b', 'i', 'strong', 'em', 'u'],
          wrapLineLength: 0,
          extra_liners: []
        },
        css: {
          indentChar: ' ',
          indentSize: 2
        },
        js: {
          braceStyle: 'collapse',
          breakChainedMethods: false,
          e4x: false,
          evalCode: false,
          indentChar: ' ',
          indentLevel: 0,
          indentSize: 2,
          indentWithTabs: false,
          jslintHappy: false,
          keepArrayIndentation: false,
          keepFunctionIndentation: false,
          maxPreserveNewlines: 10,
          preserveNewlines: true,
          spaceBeforeConditional: true,
          spaceInParen: false,
          unescapeStrings: false,
          wrapLineLength: 0
        }
      }))

    .pipe(gulp.dest(pagesConfig.dest))
  ;

  server && serverUtils.reloadServer(serverConfig.devServerName, stream);

  return stream;
});

gulp.task('pages:compile:cleanup', function (cb) {
  if (!getObject.get(pagesConfig, 'cleanups') || !pagesConfig.cleanups) {
    cb();
    return;
  }

  return del(pagesConfig.cleanups);
});


gulp.task('pages:build', function (cb) {
  runSequence('pages:copier', 'pages:compile', cb);
});

gulp.task('pages:build:cleanup', function (cb) {
  runSequence(['pages:copier:cleanup', 'pages:compile:cleanup'], cb);
});


gulp.task('pages:dist', function (cb) {
  runSequence('pages:build', cb);
});

gulp.task('pages:dist:cleanup', function (cb) {
  runSequence('pages:build:cleanup', cb);
});


gulp.task('pages:watch', function () {
  server = serverUtils.runServer(serverConfig.devServerName);

  gulp.watch(__.getGlobPaths(pagesConfig.src, pagesConfig.extnames, true), ['pages:compile']);

  var copiers = getObject.get(pagesConfig, 'copier');
  if (copiers) {
    copiers = (!_.isArray(copiers)) ? [copiers] : copiers;
    copiers = _.map(copiers, function (copier) {
      return __.getCopier(copier).from;
    });
    copiers = _.compact(copiers);
    copiers.length && gulp.watch(copiers, ['pages:copier']);
  }
});
