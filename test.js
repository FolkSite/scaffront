var __ = require('./gulpfile.js/helpers/index');
var _ = require('lodash');
var Extend = require('extend');
var Path = require('path');

var getObject = require('getobject');

var pathes = [
  'app/images',
  'app/i/**',
  '!app/i/tmp',
];
var exts = [
  '.jpg',
  '.css',
  '!min.css',
  '*.png',
  '!_*tmp.png',
];

console.log(__.getGlobPaths(pathes, exts));

var getLastFunc = function (arr) {
  //console.log(_(__.getArray(arr || null)).reverse());
  var func = null;
  _(__.getArray(arr || null)).reverse().some(function (item) {
    //console.log(item);
    func = item;
    return (_.isFunction(item));
  });

  return func;
};


//console.log(getLastFunc(arr).toString());


return;

var config = {};

config.src = 'app/styles';
config.dest = 'dist/css';
config.extnames = [];

config.sass = {
  build: {

  },
  dist: {

  }
};

config.build = {
  //src: 'app/styles',
  dest: 'dist/css/build',
  //extnames: [],

  sass: {
    //src: 'app/styles',
    //dest: 'dist/css/sass',
    extnames: ['sass', 'scss'],

  },
  css: {
    //src: 'app/styles',
    //dest: 'dist/css',
    extnames: 'css',

    gulpFileInclude: {
      prefix: '//= ',
      basepath: '@file'
    }
  }
};

console.log(getObject.get(config, 'build.sass.dest'));


return;

var file = 'entry.js';
var path = 'app/scripts';
var pathToFile = Path.join(path, file);

/**
 * @param {string} path
 * @param {boolean} [format=false]
 * @returns {{root: string, dir: string, base: string, ext: string, name: string, isOnlyFile: boolean, isOnlyPath: boolean, isPathToFile: boolean}|string}
 */
var parsePath = function (path, format) {
  format = !!format;
  var isFile = Helpers.isFile(path);
  var parsed = Path.parse(path);

  if (!isFile) {
    parsed.base = '';
    parsed.name = '';
    parsed.dir = path;
  } else {
    parsed.dir = parsed.dir.split(Path.sep).join('/');
  }

  parsed.isPathToFile = isFile && !!parsed.dir;
  parsed.isOnlyFile   = isFile && !parsed.isPathToFile;
  parsed.isOnlyPath   = !isFile;

  return (format)
    ? Path.normalize(Path.format(parsed))
    : parsed;
};



console.log(parsePath(file), parsePath(file, true));
console.log(parsePath(path), parsePath(path, true));
console.log(parsePath(pathToFile), parsePath(pathToFile, true));
console.log(Path.normalize(parsePath(pathToFile).dir));


