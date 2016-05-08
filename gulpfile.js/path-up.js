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
 * @returns {string}
 */
var convertToPosix = function pathUp$convertToPosix (pathname) {
  return pathname.split('\\').join('\/');
};

/**
 * @param {string} pathname
 * @returns {string}
 */
var convertToWin32 = function pathUp$convertToWin32 (pathname) {
  return pathname.split('\/').join('\\');
};

/**
 * @param {string} pathname
 * @param {string} [convertTo='']
 * @returns {string}
 */
var normalize = function pathUp$normalize (pathname, convertTo) {
  assertPath(pathname);

  pathname = path.normalize(pathname);
  pathname = (isWin)
    ? path.posix.normalize(convertToPosix(pathname))
    : path.win32.normalize(convertToWin32(pathname))
  ;

  convertTo = (!isUndefined(convertTo)) ? convertTo.trim() : '';
  switch (convertTo) {
    case 'win32':
      pathname = convertToWin32(pathname);
      break;
    case 'posix':
      pathname = convertToPosix(pathname);
      break;
    default:
      pathname = (isWin) ? convertToWin32(pathname) : convertToPosix(pathname);
  }

  return pathname;
};

var norm = function (pathname, convertTo) {
  assertPath(pathname);

  convertTo = convertTo || '';
  console.log(pathname, convertTo, normalize(pathname, convertTo || ''));
};


norm('\\123/qwe\\asd//zxc');
norm('\\123/qwe\\asd//zxc', 'win32');
norm('\\123/qwe\\asd//zxc', 'posix');

return;
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
  pathname = path.posix.normalize(pathname);
  pathname = path.dirname(pathname);

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
  //console.log('leadingPathname', leadingPathname);
  //console.log('pathname', pathname);

  if (pathname.indexOf(leadingPathname) === 0) {
    return pathname.slice(leadingPathname.length);
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
//let defaults = {
//  cwd:      process.cwd(),
//  base:     '',
//  dirname:  '',
//  basename: '',
//  extname:  ''
//};

class VinylPath {
  constructor (pathname, opts) {
    assertPath(pathname);

    opts = opts || {};

    this.win32 = (!isUndefined(opts.win32)) ? !!opts.win32 : process.platform == 'win32';

    this.cwd      = opts.cwd || '';
    this.base     = opts.base || '';
    this.dirname  = '';
    this.basename = '';
    this.path     = pathname;
  }

  static normalize (pathname) {
    assertPath(pathname);

    if (isWin) {
      pathname = path.normalize(pathname);
      pathname = pathname.replace(/\\/g, '/');
    }

    pathname = path.posix.normalize(pathname);

    return pathname;
  }

  set cwd (cwd) {
    assertPath(cwd);

    // `cwd` - это корень всего
    this._cwd = cwd || processCwd;
    this._cwd = VinylPath.normalize(this._cwd);
    this._cwd = addLeadingSlash(this._cwd);
    this._cwd = removeTrailingSlash(this._cwd);
  }

  set base (base) {
    assertPath(base);

    // `base` всегда должен быть относительным по отношению к `cwd`
    this._base = base;
    this._base = VinylPath.normalize(this._base);
    this._base = removeLeadingSlash(this._base);
    this._base = removeTrailingSlash(this._base);
  }

  set dirname (dirname) {
    assertPath(dirname);

    // `dirname` всегда должен быть относительным по отношению к `base`
    this._dirname = dirname || '';
    this._dirname = VinylPath.normalize(this._dirname);
    this._dirname = removeLeadingSlash(this._dirname);
    this._dirname = removeTrailingSlash(this._dirname);
  }

  set basename (basename) {
    assertPath(basename);
    // а если здесь тоже директория?
    this._basename = basename || '';
    this._basename = VinylPath.normalize(this._basename);
    this._extname  = path.extname(this._basename);
  }

  set extname (extname) {
    assertPath(extname);

    extname = (extname && !/^\./.test(extname)) ? '.'+ extname : extname;

    this._basename = path.basename(this.basename, this.extname);
    this._basename += extname;
    this._extname = extname;
  }

  set path (pathname) {
    assertPath(pathname);

    pathname = VinylPath.normalize(pathname);
    //console.log('this.cwd', this.cwd);
    //console.log('this.base', this.base);

    pathname = removeLeadingPath(pathname, this.cwd);
    pathname = removeLeadingSlash(pathname);
    pathname = (isDotDotRelative(pathname)) ? path.resolve(this.cwd, pathname) : pathname;
    //console.log('pathname', pathname);

    pathname = removeLeadingPath(pathname, this.base);
    pathname = removeLeadingSlash(pathname);
    pathname = (isDotDotRelative(pathname)) ? path.resolve(this.base, pathname) : pathname;
    //console.log('pathname', pathname);

    pathname = removeTrailingSlash(pathname);

    if (isPathToFile(pathname)) {
      this._dirname = VinylPath.normalize(withoutFile(pathname));
      this.basename = path.basename(pathname);
    } else {
      this._dirname = VinylPath.normalize(pathname);
    }

    /*
    если `pathname` содержит cwd, то удаляем cwd
    если `pathname` содержит base, то удаляем base

    получившееся резолвим (path.relative) относительно cwd + base
    выдираем и записываем имя файла в basename и директорию в dirname
    */
  }

  get path () {
    //return this._path;
    // path - это всегда полный резолв всех составляющих, учитывая `this.win32`
    return VinylPath.normalize(path.join(this.cwd, this.base, this.dirname, this.basename));
  }

  get cwd () {
    return this._cwd;
  }

  get base () {
    return this._base;
  }

  get dirname () {
    return this._dirname;
  }

  get basename () {
    return this._basename;
  }

  get stem () {
    return path.basename(this.basename, this.extname);
  }

  get extname () {
    return this._extname;
  }

  get toString() {
    return this.path;
  }
}

//var File = require('vinyl');
var File = VinylPath;

var file = new File('D:\\repositories\\scaffront\\app\\frontend\\css\\css.scss', {
  base: '/app/frontend'
});

var inspectFile = function inspectFile (file) {
  ['path', 'cwd', 'base', 'dirname', 'basename', 'stem', 'extname'].forEach(function (key) {
    if (typeof file[key] == 'function') { return; }

    console.log('==', key, '==\n  ', file[key]);
  });
};

inspectFile(file);

const fs = require('fs');
console.log('exists', fs.existsSync(file.path));

//console.log('file', file);
//console.log('file', file.inspect());







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






