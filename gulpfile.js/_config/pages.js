var _                = require('lodash'),
    __               = require('../helpers'),
    path             = require('path'),
    extend           = require('extend'),
    fs               = require('fs'),
    gulp             = require('gulp'),
    gulpTap          = require('gulp-tap'),
    gulpData         = require('gulp-data'),
    gulpRename       = require('gulp-rename'),
    gulpConsolidate  = require('gulp.consolidate'),
    gulpJsBeautifier = require('gulp-jsbeautifier')
  ;


var utils = {};

utils.getTplData = function (tplFile) {
  var dataFile,
      data = {},
      parsed = path.parse(tplFile.path),
      ext = '.js';

  parsed.name = parsed.name + '-data';
  parsed.ext  = ext;
  parsed.base = parsed.name + ext;

  dataFile = path.format(parsed);

  if (dataFile && fs.existsSync(dataFile)) {
    data = require(dataFile);

    if (!_.isPlainObject(data)) {
      try {
        data = JSON.parse(data);
        data = data || {}; // prevent null
      } catch (e) { data = {}; }
    }
  }

  return data;
};

var src = 'app/pages';

var config = {};

config.src = __.getGlobPaths(src, ['tpl'], true);
config.dest = 'dist/pages';

config.tplsData = require('../../app/pages/globals-data');

config.transform = function (stream) {

  return stream
    .pipe(gulpData(utils.getTplData))
    .pipe(gulpConsolidate('swig', config.tplsData || {}, {
      //setupEngine: function (engine, Engine) {
      //  return Engine;
      //}
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
  ;
};

config.cleanups = __.getGlobPaths(config.dest, ['html'], true);

config.copier = [{
  from: __.getGlobPaths(src, ['*-data.js', '*-data.json'], true),
  to: config.dest,
  transform: function (stream) {
    stream
      .pipe(gulpTap(function (file) {
        if (fs.existsSync(file.path)) {
          file.contents = new Buffer(JSON.stringify(require(file.path), null, 2));
        }
      }))
      .pipe(gulpRename({extname: '.json'}));

    return stream;
  },
  cleanups: __.getGlobPaths(config.dest, ['*-data.json'], true)
}];


module.exports.utils  = utils;
module.exports.config = config;