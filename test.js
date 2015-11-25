var Helpers = require('./gulpfile.js/helpers/index');
var _ = require('lodash');
var Extend = require('extend');
var Path = require('path');


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


