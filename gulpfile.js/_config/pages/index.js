var _               = require('lodash'),
    __              = require('../../helpers'),
    path            = require('path'),
    extend          = require('extend'),
    gulp            = require('gulp'),
    fs              = require('fs'),
    gulpTap         = require('gulp-tap'),
    gulpData        = require('gulp-data'),
    gulpConsolidate = require('gulp.consolidate'),
    gulpRename      = require('gulp-rename')
  ;


var utils = {};

utils.getTplData = function (tplFile) {
  var dataFile,
      data = {},
      parsed = path.parse(tplFile.path),
      ext = '.js';

  parsed.name = parsed.name +'-data';
  parsed.ext = ext;
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

config.src = __.getGlobPaths(src, ['html', 'tpl'], true);
config.dest = 'dist/pages';

config.tplsData = require('../../../app/pages/globals-data');

config.transform = function (stream) {
  stream
    .pipe(gulpData(utils.getTplData))
    .pipe(gulpConsolidate('swig', config.tplsData || {}, {
      setupEngine: function (engine, Engine) {
        return Engine;
      }
      //useContents: true
    }))
    .pipe(gulpRename({extname: '.html'}));

  return stream;
};

config.cleanups = __.getGlobPaths(config.dest, ['html'], true);

config.copier = [{
  from: __.getGlobPaths(src, ['*-data.js', '*-data.json'], true),
  to: config.dest,
  transform: function (stream) {
    stream
      .pipe(gulpTap(function (file) {
        file.contents = new Buffer(JSON.stringify(require(file.path), null, 2));
      }))
      .pipe(gulpRename({extname: '.json'}));

    return stream;
  },
  cleanups: __.getGlobPaths(config.dest, ['*-data.json'], true)
}];



module.exports.utils  = utils;
module.exports.config = config;