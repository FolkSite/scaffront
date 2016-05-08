'use strict';

const isUndefined   = require('lodash/lang/isUndefined');
const isPlainObject = require('lodash/lang/isPlainObject');
const path          = require('path');
const sep           = path.sep;
const isWin         = process.platform == 'win32';

/**
 * @param {string} pathname
 * @returns {boolean}
 */
var isPathToDotFile = function pathUp$isPathToDotFile (pathname) {
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
  return !!path.extname(pathname) || isPathToDotFile(pathname);
};

/**
 * @param {string} pathname
 * @returns {boolean}
 */
var isPathFromWin32Device = function pathUp$isPathFromWin32Device (pathname) {
  return path.win32.isAbsolute(pathname) && /^[a-z]:/i.test(pathname);
};

/**
 * @param {string} pathname
 * @returns {string}
 */
var withoutFile = function pathUp$withoutFile (pathname) {
  return (isPathToFile(pathname)) ? path.dirname(pathname) : pathname;
};

/**
 * @param {string} pathname
 * @returns {boolean}
 */
var hasLeadingDotSlash = function pathUp$hasLeadingDotSlash (pathname) {
  return /^\.\//.test(pathname) || /^\.\\/.test(pathname);
};

/**
 * @param {string} pathname
 * @returns {boolean}
 */
var isRelative = function pathUp$isRelative (pathname) {
  return !path.isAbsolute(pathname);
};

/**
 * @param {string} pathname
 * @returns {boolean}
 */
var isDotDotRelative = function pathUp$isDotDotRelative (pathname) {
  return isRelative(pathname) && (/^\.\.\//.test(pathname) || /^\.\.\\/.test(pathname));
};

/**
 * @param {string} pathname
 * @returns {string}
 */
var removeLeadingDotSlash = function pathUp$removeLeadingDotSlash (pathname) {
  return pathname.replace(/^\.[\/\\]+/, '');
};

/**
 * @param {string} pathname
 * @returns {string}
 */
var addLeadingDotSlash = function pathUp$addLeadingDotSlash (pathname) {
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
  if (!isPathFromWin32Device(pathname)) {
    pathname = pathname.replace(/^[\/\\]+/, '');
  }

  return pathname;
};

/**
 * @param {string} pathname
 * @returns {string}
 */
var addLeadingSlash = function pathUp$addLeadingSlash (pathname) {
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
  pathname = pathname.replace(/[\/\\]+$/, '');

  return pathname;
};

/**
 * @param {string} pathname
 * @returns {string}
 */
var addTrailingSlash = function pathUp$addTrailingSlash (pathname) {
  if (!isPathToFile(pathname)) {
    pathname = removeTrailingSlash(pathname) +'/';
  }

  return pathname;
};

/**
 * @param {string} _path
 * @param {string} leadingPath
 * @returns {string}
 */
var removeLeadingPath = function pathUp$removeLeadingPath (_path, leadingPath) {
  var pathToCompare = _path, leadingToCompare = leadingPath;

  leadingToCompare = (isPathToFile(leadingToCompare)) ? withoutFile(leadingToCompare) : leadingToCompare;



  return '';
};

/**
 * @param {string} dir
 * @param {string} cwd
 * @returns {string}
 */
let getRelativeFromCwd = function pathUp$getRelativeFromCwd (dir, cwd) {
  cwd = path.dirname(cwd);
  dir = path.dirname(dir);

  var cwdIsRelative = !path.isAbsolute(cwd);
  var dirIsRelative = !path.isAbsolute(dir);

  var cwdAbsolute, cwdRelative;
  var dirAbsolute, dirRelative;

  if (cwdIsRelative) {
    cwdAbsolute = path.join(sep, cwd);
    cwdRelative = cwd;
  } else {
    cwdAbsolute = cwd;
    cwdRelative = cwd.slice(sep.length);
  }

  if (dirIsRelative) {
    dirAbsolute = path.join(sep, dir);
    dirRelative = dir;
  } else {
    dirAbsolute = dir;
    dirRelative = dir.slice(sep.length);
  }

  cwdAbsolute = path.dirname(cwdAbsolute);
  dirAbsolute = path.dirname(dirAbsolute);

  /*
  ('/is/cwd/',  '/is/cwd/dir/name/') === 'dir/name';
  ( 'is/cwd/',  '/is/cwd/dir/name/') === 'dir/name';
  ('/is/cwd/', './is/cwd/dir/name/') === 'dir/name';
  ( 'is/cwd/', './is/cwd/dir/name/') === 'dir/name';
  ('/is/cwd/',   'is/cwd/dir/name/') === 'dir/name';
  ( 'is/cwd/',   'is/cwd/dir/name/') === 'dir/name';

  ('/is/cwd/',  '/dir/name/') === 'dir/name';
  ( 'is/cwd/',  '/dir/name/') === 'dir/name';
  ('/is/cwd/', './dir/name/') === 'dir/name';
  ( 'is/cwd/', './dir/name/') === 'dir/name';
  ('/is/cwd/',   'dir/name/') === 'dir/name';
  ('/is/cwd/',   'dir/name/') === 'dir/name';

  ('C:\\is\\cwd\\',  'C:\\is\\cwd\\dir\\name\\') === 'dir\\name';
  ('C:\\is\\cwd\\',  '\\dir\\name\\') === 'dir\\name';
  ('\\is\\cwd\\',  'C:\\is\\cwd\\dir\\name\\') === 'dir\\name';

  ('/is/cwd/', './is/cwd/dir/name/') === 'dir/name';
  ( 'is/cwd/', './is/cwd/dir/name/') === 'dir/name';
  ('/is/cwd/',   'is/cwd/dir/name/') === 'dir/name';
  ( 'is/cwd/',   'is/cwd/dir/name/') === 'dir/name';

  ('/is/cwd/',  '/dir/name/') === 'dir/name';
  ( 'is/cwd/',  '/dir/name/') === 'dir/name';
  ('/is/cwd/', './dir/name/') === 'dir/name';
  ( 'is/cwd/', './dir/name/') === 'dir/name';
  ('/is/cwd/',   'dir/name/') === 'dir/name';
  ('/is/cwd/',   'dir/name/') === 'dir/name';

  ('', '');

  */

  if (dirAbsolute.indexOf(cwdAbsolute) === 0) {
    dir = dirAbsolute.slice(cwdAbsolute.length);
  } else {
    //dir = path.resolve(cwdAbsolute, dirRelative);
  }




  cwd = (isPathToFile(cwd)) ? path.dirname(cwd) : cwd;
  dir = (isPathToFile(dir)) ? path.dirname(dir) : dir;

  let cwdForCompare, dirForCompare;
  let cwdIsAbsolute, dirIsAbsolute;

  cwdIsAbsolute = path.isAbsolute(cwd);
  dirIsAbsolute = path.isAbsolute(dir);
  if (isWin) {
    if (cwdIsAbsolute && !/^[a-z]:/i.test(cwd)) {
      cwdIsAbsolute = false;
      cwd = cwd.slice(sep.length);
    }
    if (dirIsAbsolute && !/^[a-z]:/i.test(dir)) {
      dirIsAbsolute = false;
      dir = dir.slice(sep.length);
    }
  } else {

  }

  if (cwdIsAbsolute && dirIsAbsolute) {
    cwdForCompare = cwd;
    dirForCompare = dir;
  } else
  if (cwdIsAbsolute && !dirIsAbsolute) {
    cwdForCompare = cwd;
    dirForCompare = (dir.indexOf(`.${sep}`) === 0) ? dir.slice(1) : sep + dir;
  } else
  if (!cwdIsAbsolute && dirIsAbsolute) {
    cwdForCompare = (cwd.indexOf(`.${sep}`) === 0) ? cwd.slice(1) : sep + cwd;
    dirForCompare = dir;
  } else
  if (!cwdIsAbsolute && !dirIsAbsolute) {
    cwdForCompare = (cwd.indexOf(`.${sep}`) === 0) ? cwd.slice(1) : sep + cwd;
    dirForCompare = (dir.indexOf(`.${sep}`) === 0) ? dir.slice(1) : sep + dir;
  }

  var retVal;
  if (dirForCompare.indexOf(cwdForCompare) === 0) {
    retVal = dirForCompare.slice(cwdForCompare.length);
  } else {
    //retVal =
  }

  return retVal;

  if (!isWin) {

  } else {

  }



  if (!path.isAbsolute(dir)) {
    if (!isWin) {

    }
  } else {
    if (isWin) {

    } else {

    }
  }



  if (dir.indexOf(cwd) !== 0) {
    dir = path.join(cwd, dir);
  }
  dir = path.relative(cwd, dir);

  return dir;
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
    this._cwd      = '';
    this._base     = '';
    this._dirname  = '';
    this._basename = '';
    this._extname  = '';

    parse.call(this, _path, opts);
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

  get toString() {
    return this.path;
  }
}

module.exports = {
  VinylPath
};
