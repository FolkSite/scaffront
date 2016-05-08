'use strict';

const isUndefined   = require('lodash/lang/isUndefined');
const isPlainObject = require('lodash/lang/isPlainObject');
const path          = require('path');
const util          = require('util');
const isWin         = process.platform == 'win32';
const sep           = path.sep;

function assertPath (path) {
  if (typeof path !== 'string') {
    throw new TypeError('Path must be a string. Received '+ util.inspect(path));
  }
}

/**
 * @param {string} pathname
 * @returns {boolean}
 */
var isPathToDotFile = function pathUp$isPathToDotFile (pathname) {
  assertPath(pathname);

  pathname = path.normalize(pathname);

  let parts = pathname.split(sep);
  let last = parts[parts.length - 1];

  return /^\./.test(last);
};

/**
 * @param {string} pathname
 * @returns {boolean}
 */
var isPathToFile = function pathUp$isPathToFile (pathname) {
  assertPath(pathname);

  return !!path.extname(pathname) || isPathToDotFile(pathname);
};

/**
 * @param {string} pathname
 * @returns {boolean}
 */
var isPathFromWin32Device = function pathUp$isPathFromWin32Device (pathname) {
  assertPath(pathname);

  return path.win32.isAbsolute(pathname) && /^[a-z]:/i.test(pathname);
};

/**
 * @param {string} pathname
 * @returns {string}
 */
var withoutFile = function pathUp$withoutFile (pathname) {
  assertPath(pathname);

  return (isPathToFile(pathname)) ? path.dirname(pathname) : pathname;
};

/**
 * @param {string} pathname
 * @returns {boolean}
 */
var hasLeadingDotSlash = function pathUp$hasLeadingDotSlash (pathname) {
  assertPath(pathname);

  return /^\.\//.test(pathname) || /^\.\\/.test(pathname);
};

/**
 * @param {string} pathname
 * @returns {boolean}
 */
var isRelative = function pathUp$isRelative (pathname) {
  assertPath(pathname);

  return !path.isAbsolute(pathname);
};

/**
 * @param {string} pathname
 * @returns {boolean}
 */
var isDotDotRelative = function pathUp$isDotDotRelative (pathname) {
  assertPath(pathname);

  return isRelative(pathname) && (/^\.\.\//.test(pathname) || /^\.\.\\/.test(pathname));
};

/**
 * @param {string} pathname
 * @returns {string}
 */
var removeLeadingDotSlash = function pathUp$removeLeadingDotSlash (pathname) {
  assertPath(pathname);

  return pathname.replace(/^\.[\/\\]+/, '');
};

/**
 * @param {string} pathname
 * @returns {string}
 */
var addLeadingDotSlash = function pathUp$addLeadingDotSlash (pathname) {
  assertPath(pathname);

  if (!isPathFromWin32Device(pathname)) {
    pathname = './'+ removeLeadingDotSlash(pathname);
  }

  return pathname;
};

/**
 * @param {string} pathname
 * @returns {string}
 */
var removeLeadingSlash = function pathUp$removeLeadingSlash (pathname) {
  assertPath(pathname);

  pathname = pathname.replace(/^[\/\\]+/, '');

  return pathname;
};

/**
 * @param {string} pathname
 * @returns {string}
 */
var addLeadingSlash = function pathUp$addLeadingSlash (pathname) {
  assertPath(pathname);

  if (!isPathFromWin32Device(pathname)) {
    pathname = '/'+ removeLeadingSlash(pathname);
  }

  return pathname;
};

/**
 * @param {string} pathname
 * @returns {string}
 */
var removeTrailingSlash = function pathUp$removeTrailingSlash (pathname) {
  assertPath(pathname);

  pathname = pathname.replace(/[\/\\]+$/, '');

  return pathname;
};

/**
 * @param {string} pathname
 * @returns {string}
 */
var addTrailingSlash = function pathUp$addTrailingSlash (pathname) {
  assertPath(pathname);

  if (!isPathToFile(pathname)) {
    pathname = removeTrailingSlash(pathname) +'/';
  }

  return pathname;
};

/**
 * @param {string} pathname
 * @param {string} leadingPathname
 * @returns {boolean}
 */
var hasLeadingPath = function pathUp$hasLeadingPath (pathname, leadingPathname) {
  assertPath(pathname);
  assertPath(leadingPathname);

  leadingPathname = (isPathToFile(leadingPathname)) ? withoutFile(leadingPathname) : leadingPathname;
  leadingPathname = removeLeadingDotSlash(leadingPathname);
  leadingPathname = removeLeadingSlash(leadingPathname);

  pathname = removeLeadingDotSlash(pathname);
  pathname = removeLeadingSlash(pathname);

  return (pathname.indexOf(leadingPathname) === 0)
};

/**
 * @param {string} pathname
 * @param {string} leadingPathname
 * @returns {string}
 */
var removeLeadingPath = function pathUp$removeLeadingPath (pathname, leadingPathname) {
  assertPath(pathname);
  assertPath(leadingPathname);

  var enterPathname = pathname;

  leadingPathname = (isPathToFile(leadingPathname)) ? withoutFile(leadingPathname) : leadingPathname;
  leadingPathname = removeLeadingDotSlash(leadingPathname);
  leadingPathname = removeLeadingSlash(leadingPathname);

  pathname = removeLeadingDotSlash(pathname);
  pathname = removeLeadingSlash(pathname);

  if (pathname.indexOf(leadingPathname) === 0) {
    return pathname;
  }

  return enterPathname;
};

/**
 * @param _path
 * @param opts
 * @this VirtualPath
 */
let parse = function VirtualPath$parse (_path, opts) {
  this._cwd = opts.cwd || this._cwd || defaults.cwd;
  this._base = opts.base || this._base || defaults.base;



  this._basename = '';
  this._extname = '';

  this.cwd = opts.cwd || '';
  this.base = opts.base || '';


  // isPathToFile
  var ext = path.extname(_path);

  this.basename = path.basename(_path);
  this.extname = ext;
};


var processCwd = process.cwd();
let defaults = {
  cwd:      process.cwd(),
  base:     '',
  dirname:  '',
  basename: '',
  extname:  ''
};

class VinylPath {
  constructor (_path, opts) {
    opts = opts || {};

    this.win32     = (!isUndefined(opts.win32)) ? !!opts.win32 : process.platform == 'win32';
    this._cwd      = opts.cwd  || processCwd;
    this._base     = opts.base || '';
    this._path     = opts.path || '';
    this._dirname  = '';



    this._basename = '';
    this._extname  = '';

    parse.call(this, _path, opts);
  }

  set path (pathname) {
    // устанавливая новый pathname, надо зарезолвить
  }

  set cwd (cwd) {
    this._cwd = cwd || defaults.cwd;
  }
  get cwd () {
    return this._cwd;
  }

  set base (base) {
    this._base = base || defaults.base;
  }
  get base () {
    return this._base;
  }

  set dirname (dirname) {
    this._dirname = dirname || defaults.dirname;
  }
  get dirname () {
    return this._dirname;
  }

  set basename (basename) {
    this._basename = basename || defaults.basename;
    this._extname = path.extname(this._basename);
  }
  get basename () {
    return path.basename(this._basename);
  }

  set extname (extname) {
    this._extname = extname || defaults.extname;
  }
  get extname () {
    return path.extname(this._extname);
  }

  get stem () {
    return path.basename(this.basename, this.extname);
  }

  //get path () {
  //  return path.join(this.cwd, this.base, this.dirname, this.basename);
  //}

  //get toString() {
  //  return this.path;
  //}
}

module.exports = {
  isPathToDotFile,
  isPathToFile,
  isPathFromWin32Device,
  withoutFile,
  hasLeadingDotSlash,
  isRelative,
  isDotDotRelative,
  removeLeadingDotSlash,
  addLeadingDotSlash,
  removeLeadingSlash,
  addLeadingSlash,
  removeTrailingSlash,
  addTrailingSlash,
  hasLeadingPath,
  removeLeadingPath,
  VinylPath
};


var File = require('vinyl');

console.log('path.join(__dirname, __filename)', path.join(__dirname, __filename));
var file = new File({
  path: path.join(__dirname, __filename)
});

var inspectFile = function inspectFile (file) {
  ['cwd', 'base', 'relative', 'dirname', 'basename', 'extname', 'stem'].forEach(function (key) {
    if (typeof file[key] == 'function') { return; }

    console.log('==', key, file[key]);
  });
};

inspectFile(file);

//console.log('file', file);
//console.log('file', file.inspect());





