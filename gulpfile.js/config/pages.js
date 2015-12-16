var _                = require('lodash'),
    __               = require('../helpers'),
    path             = require('path'),
    extend           = require('extend'),
    fs               = require('fs'),
    gulp             = require('gulp'),
    gulpTap          = require('gulp-tap'),
    gulpRename       = require('gulp-rename')
  ;

var utils = {};

utils.getTplData = function (tplFile) {
  var dataFile,
      data = {},
      tmp = null,
      parsed = path.parse(tplFile.path),
      ext = '.js';

  parsed.name = parsed.name + '-data';
  parsed.ext  = ext;
  parsed.base = parsed.name + ext;

  dataFile = path.format(parsed);

  if (dataFile && fs.existsSync(dataFile)) {
    tmp = require(dataFile);

    if (!_.isPlainObject(tmp)) {
      try {
        tmp = JSON.parse(data);
        data = tmp || data;
      } catch (e) {}
    } else {
      data = tmp;
    }
  }

  return data;
};

var config = {};

config.src = path.join(global.Builder.src, 'pages');
config.extnames = ['*.tpl', '!_*.tpl', '!/_**/*.tpl'];
config.dest = path.join(global.Builder.dest, 'pages');


//var globTest = __.getGlobPaths(path.join(config.src, 'test'), ['*.tpl', '!_*.tpl', '!/_**/*.tpl'], true);
//var globTest = __.getGlobPaths(path.join(config.src, 'test'), ['**/*.tpl'/*, '!**!/_*!/!**'*/]);

//console.log(globTest);
//
//var glob = require('glob');
//var files = [];
//gulp.src(globTest)
//  .pipe(gulpTap(function (file) {
//    files.push(file.path);
//  })).on('end', function () {
//    console.log(files);
//  });


// '../../app/pages/globals-data'
var srcRelative = path.relative(path.dirname(__filename), config.src);
config.tplsData = require(path.join(srcRelative, 'globals-data')) || {};

config.cleanups = __.getGlobPaths(config.dest, ['html'], true);

config.copier = [{
  from: __.getGlobPaths(config.src, ['*-data.js', '*-data.json'], true),
  to: config.dest,
  transform: function (stream) {
    return stream
      .pipe(gulpTap(function (file) {
        var data = '{}',
            tmp = null
          ;

        if (fs.existsSync(file.path)) {

          try {
            tmp = require(file.path);
            if (_.isPlainObject(tmp)) {
              tmp = JSON.stringify(tmp, null, 2);
              data = tmp || data;
            }
          } catch (e) {}

          file.contents = new Buffer(data);
        }
      }))
      .pipe(gulpRename({extname: '.json'}));
  },
  cleanups: __.getGlobPaths(config.dest, ['*-data.json'], true)
}];


module.exports.utils  = utils;
module.exports.config = config;