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

var src = 'app/_tpl';

var config = {};

config.src = __.getGlobPaths(src, ['tpl'], true);
config.dest = 'dist/_tpl';

config.transform = function (stream) {

  return stream

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