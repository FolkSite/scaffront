'use strict';

const isUndefined   = require('lodash/lang/isUndefined');
const isPlainObject = require('lodash/lang/isPlainObject');
const path          = require('path');
const sep           = path.sep;
const isWin         = process.platform == 'win32';

let defaults = {
  cwd:      process.cwd(),
  base:     '',
  dirname:  '',
  basename: '',
  extname:  ''
};

/**
 * @param {string} _path
 * @returns {boolean}
 */
var isPathToDotFile = function pathUp$isPathToDotFile (_path) {
  _path = path.normalize(_path);

  let parts = _path.split(sep);
  let last = parts[parts.length - 1];

  return /^\./.test(last);
};

/**
 * @param {string} _path
 * @returns {boolean}
 */
var isPathToFile = function pathUp$isPathToFile (_path) {
  // если есть расширение или это dot-файл
  return !!path.extname(_path) || isPathToDotFile(_path);
};

/**
 * @param {string} _path
 * @returns {boolean}
 */
var isPathFromWin32Device = function pathUp$isWin32RootPath (_path) {
  return path.win32.isAbsolute(_path) && /^[a-z]:/i.test(_path);
};

/**
 * @param {string} _path
 * @returns {string}
 */
var getWithoutFile = function pathUp$getWithoutFile (_path) {
  return (isPathToFile(_path)) ? path.dirname(_path) : _path;
};

/**
 * @param {string} _path
 * @returns {boolean}
 */
var hasLeadingDotSlash = function pathUp$hasLeadingDotSlash (_path) {
  return /^\.\//.test(_path) || /^\.\\/.test(_path);
};

/**
 * @param {string} _path
 * @returns {boolean}
 */
var isRelative = function pathUp$isRelative (_path) {
  return !path.isAbsolute(_path);
};

/**
 * @param {string} _path
 * @returns {boolean}
 */
var isDotDotRelative = function pathUp$isDotDotRelative (_path) {
  return isRelative(_path) && (/^\.\.\//.test(_path) || /^\.\.\\/.test(_path));
};

/**
 * @param {string} _path
 * @returns {string}
 */
var removeLeadingDotSlash = function pathUp$removeLeadingDotSlash (_path) {
  return _path.replace(/^\.[\/\\]+/, '');
};

/**
 * @param {string} _path
 * @returns {string}
 */
var addLeadingDotSlash = function pathUp$addLeadingDotSlash (_path) {
  if (!isPathFromWin32Device(_path)) {
    let pathIsAbsolute = path.isAbsolute(_path);
    if (!hasLeadingDotSlash(_path)) {
      _path = (pathIsAbsolute) ? '.'+ _path : './'+ path;
    }
  }

  return _path;
};

/**
 *
 * @param {string} _path
 * @param {{}|boolean} [opts]
 * @param {boolean} [opts.leading]
 * @param {boolean} [opts.trailing]
 */
var alterSideSlashes = function pathUp$alterSideSlashes (_path, opts) {
  if (isUndefined(opts)) { return _path; }

  if (!isPlainObject(opts)) {
    opts = {
      leading:  opts,
      trailing: opts
    };
  }

  opts.leading  = (!isUndefined(opts.leading)) ? !!opts.leading : void 0;
  opts.trailing = (!isUndefined(opts.trailing)) ? !!opts.trailing : void 0;

  if (opts.leading === true) {

  } else
  if (opts.leading === false) {

  }

  if (opts.trailing === true) {

  } else
  if (opts.trailing === false) {

  }


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
