'use strict';

const isUndefined   = require('lodash/lang/isUndefined');
const isPlainObject = require('lodash/lang/isPlainObject');
const path          = require('path');
const util          = require('util');
const isWin         = process.platform == 'win32';
const processCwd    = process.cwd();

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
 * @returns {boolean}
 */
var isPathToDotFile = function pathUp$isPathToDotFile (pathname) {
  assertPath(pathname);

  return /[\/\\]\.[^\/\\]+$/.test(pathname);
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
 * @returns {string}
 */
var withoutFile = function pathUp$withoutFile (pathname) {
  assertPath(pathname);

  return (isPathToFile(pathname)) ? path.dirname(pathname) : pathname;
};

/**
 * @param {string} pathname
 * @param {string} [convertTo='']
 * @returns {string}
 */
var normalize = function pathUp$normalize (pathname, convertTo) {
  assertPath(pathname);

  pathname = pathname.trim();
  if (pathname) {
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
  }

  //pathname = (isPathToFile(pathname)) ? withoutFile(pathname) : pathname;

  return pathname;
};

/**
 * @param {string} pathname
 * @returns {boolean}
 */
var isPathFromWin32Device = function pathUp$isPathFromWin32Device (pathname) {
  assertPath(pathname);
  pathname = normalize(pathname, 'win32');

  return path.win32.isAbsolute(pathname) && /^[a-z]:/i.test(pathname);
};

/**
 * @param {string} pathname
 * @returns {boolean}
 */
var hasLeadingDotSlash = function pathUp$hasLeadingDotSlash (pathname) {
  assertPath(pathname);

  return /^\.[\/\\]/.test(pathname);
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
var isDot = function pathUp$isDot (pathname) {
  assertPath(pathname);

  return pathname == '.';
};

/**
 * @param {string} pathname
 * @returns {boolean}
 */
var isDotRelative = function pathUp$isDotRelative (pathname) {
  assertPath(pathname);

  return isRelative(pathname) && /^\.[\/\\]/.test(pathname);
};

/**
 * @param {string} pathname
 * @returns {boolean}
 */
var isDotDotRelative = function pathUp$isDotDotRelative (pathname) {
  assertPath(pathname);

  return isRelative(pathname) && /^\.\.[\/\\]/.test(pathname);
};

/**
 * @param {string} pathname
 * @returns {string}
 */
var removeLeadingDotSlash = function pathUp$removeLeadingDotSlash (pathname) {
  assertPath(pathname);

  let newPathname = pathname.replace(/^\.[\/\\]+/, '');

  return (pathname == newPathname) ? newPathname : pathUp$removeLeadingDotSlash(newPathname);
};

/**
 * @param {string} pathname
 * @param {string} [sep=/]
 * @returns {string}
 */
var addLeadingDotSlash = function pathUp$addLeadingDotSlash (pathname, sep) {
  assertPath(pathname);

  if (!isPathFromWin32Device(pathname)) {
    sep = sep || '/';
    pathname = '.'+ sep + removeLeadingDotSlash(pathname);
  }

  return pathname;
};

/**
 * @param {string} pathname
 * @returns {string}
 */
var removeLeadingSlash = function pathUp$removeLeadingSlash (pathname) {
  assertPath(pathname);

  let newPathname = pathname.replace(/^[\/\\]+/, '');

  return (pathname == newPathname) ? newPathname : pathUp$removeLeadingSlash(newPathname);
};

/**
 * @param {string} pathname
 * @param {string} [sep=/]
 * @returns {string}
 */
var addLeadingSlash = function pathUp$addLeadingSlash (pathname, sep) {
  assertPath(pathname);

  if (!isPathFromWin32Device(pathname)) {
    sep = sep || '/';
    pathname = sep + removeLeadingSlash(pathname);
  }

  return pathname;
};

/**
 * @param {string} pathname
 * @returns {string}
 */
var removeTrailingSlash = function pathUp$removeTrailingSlash (pathname) {
  assertPath(pathname);

  return pathname.replace(/[\/\\]+$/, '');
};

/**
 * @param {string} pathname
 * @param {string} [sep=/]
 * @returns {string}
 */
var addTrailingSlash = function pathUp$addTrailingSlash (pathname, sep) {
  assertPath(pathname);

  if (!isPathToFile(pathname)) {
    sep = sep || '/';
    pathname = removeTrailingSlash(pathname) + sep;
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

  var enterPathname = pathname;

  // приводим к одному виду
  pathname        = normalize(pathname, 'posix');
  leadingPathname = normalize(leadingPathname, 'posix');

  if (pathname == '.' || leadingPathname == '.') {
    return false;
  }

  leadingPathname = (isPathToFile(leadingPathname)) ? withoutFile(leadingPathname) : leadingPathname;
  leadingPathname = (leadingPathname != '.') ? leadingPathname : '';

  if (leadingPathname) {
    leadingPathname = removeLeadingDotSlash(leadingPathname);
    pathname        = removeLeadingDotSlash(pathname);
    leadingPathname = removeLeadingSlash(leadingPathname);
    pathname        = removeLeadingSlash(pathname);
    leadingPathname = addTrailingSlash(leadingPathname);
    pathname        = addTrailingSlash(pathname);

    return pathname.indexOf(leadingPathname) === 0;
  }

  return false;
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

  // приводим к одному виду
  pathname        = normalize(pathname, 'posix');
  leadingPathname = normalize(leadingPathname, 'posix');

  if (pathname == '.' || leadingPathname == '.') {
    return enterPathname;
  }

  leadingPathname = (isPathToFile(leadingPathname)) ? withoutFile(leadingPathname) : leadingPathname;
  leadingPathname = (!isDot(leadingPathname)) ? leadingPathname : '';

  if (leadingPathname) {
    leadingPathname = removeLeadingDotSlash(leadingPathname);
    pathname        = removeLeadingDotSlash(pathname);
    leadingPathname = removeLeadingSlash(leadingPathname);
    pathname        = removeLeadingSlash(pathname);
    leadingPathname = addTrailingSlash(leadingPathname);
    pathname        = addTrailingSlash(pathname);

    if (pathname.indexOf(leadingPathname) === 0) {
      return removeTrailingSlash(pathname.slice(leadingPathname.length));
    }
  }

  return enterPathname;
};


class VinylPath {
  static normalize (pathname) {
    assertPath(pathname);

    pathname = normalize(pathname, 'posix');

    return (!isDot(pathname)) ? pathname : '';
  }

  /**
   * @param {string|{}} pathname
   * @param {{}} [opts]
   */
  constructor (pathname, opts) {
    if (isPlainObject(pathname)) {
      opts     = pathname;
      pathname = opts.path;
    }

    opts = opts || {};

    assertPath(pathname);

    this._cwd      = '';
    this._base     = '';
    this._dirname  = '';
    this._basename = '';
    this._extname  = '';

    this.cwd      = opts.cwd  || '';
    this.base     = opts.base || '';
    this.dirname  = '';
    this.basename = '';
    this.path     = pathname;
  }

  set cwd (cwd) {
    assertPath(cwd);

    cwd = cwd || processCwd;
    cwd = (!isDot(cwd)) ? cwd : processCwd;
    cwd = VinylPath.normalize(cwd);
    cwd = addLeadingSlash(cwd);
    this._cwd = removeTrailingSlash(cwd);
  }

  set base (base) {
    assertPath(base);

    base = base || '';
    base = (!isDot(base)) ? base : '';
    if (base) {
      let tmp = removeLeadingSlash(removeLeadingDotSlash(base));
      if (isDotDotRelative(tmp)) {
        base = VinylPath.normalize(tmp);
        base = path.join(this._cwd, base);
      } else {
        base = VinylPath.normalize(base);
      }
      base = (isPathToFile(base)) ? withoutFile(base) : base;
      base = (!isDot(base)) ? base : '';
      if (base) {
        base = removeLeadingPath(base, this._cwd);
        base = removeTrailingSlash(base);
        base = removeLeadingDotSlash(base);
        base = removeLeadingSlash(base);
      }
    }

    this._base = base;

    if (this._dirname && this._base) {
      this._dirname = removeLeadingPath(this._dirname, this._base);
      this._dirname = removeTrailingSlash(this._dirname);
      this._dirname = removeLeadingDotSlash(this._dirname);
      this._dirname = removeLeadingSlash(this._dirname);
    }
  }

  set dirname (dirname) {
    assertPath(dirname);

    dirname = dirname || '';
    dirname = (!isDot(dirname)) ? dirname : '';

    let hasBase = false;
    let basename = '';
    if (dirname) {
      let tmp = removeLeadingSlash(removeLeadingDotSlash(dirname));
      if (isDotDotRelative(tmp)) {
        dirname = VinylPath.normalize(tmp);
        dirname = path.join(this._cwd, this._base, dirname);
      } else {
        dirname = VinylPath.normalize(dirname);
      }
      let isToFile = isPathToFile(dirname);
      basename = (isToFile) ? path.basename(dirname) : '';
      dirname = (isToFile) ? withoutFile(dirname) : dirname;
      dirname = (!isDot(dirname)) ? dirname : '';

      if (dirname) {
        let dirnameWithoutCwd = removeLeadingPath(dirname, this._cwd);
        if (dirnameWithoutCwd != dirname) {
          dirname = dirnameWithoutCwd;

          let dirnameWithoutBase = removeLeadingPath(dirname, this._base);
          if (dirnameWithoutBase != dirname) {
            dirname = dirnameWithoutBase;
            hasBase = true;
          }
        }

        dirname = removeTrailingSlash(dirname);
        dirname = removeLeadingDotSlash(dirname);
        dirname = removeLeadingSlash(dirname);
      }
    }

    this._dirname = dirname;

    if (this._dirname && !hasBase) {
      this._base = '';
    }

    if (basename) {
      this.basename = basename;
    }
  }

  set path (pathname) {
    assertPath(pathname);

    pathname = pathname || '';
    pathname = (!isDot(pathname)) ? pathname : '';
    let basename = '';
    if (pathname) {
      let isToFile = isPathToFile(pathname);
      basename = (isToFile) ? path.basename(pathname) : '';
      pathname = (isToFile) ? withoutFile(pathname) : pathname;
      pathname = (!isDot(pathname)) ? pathname : '';
    }

    if (pathname) {
      this.dirname = pathname;
    }

    if (basename) {
      this.basename = basename;
    }
  }

  set basename (basename) {
    assertPath(basename);

    basename = basename || '';
    let dirname = '';
    if (basename) {
      let isToFile = isPathToFile(basename);
      dirname = (isToFile) ? withoutFile(basename) : basename;
      basename = (isToFile) ? path.basename(basename) : '';
      dirname = (!isDot(dirname)) ? dirname : '';

      this._basename = basename;
      this._extname  = path.extname(this._basename);
    }

    if (dirname) {
      this.dirname = dirname;
    }
  }

  set extname (extname) {
    assertPath(extname);

    extname = (extname && !/^\./.test(extname)) ? '.'+ extname : extname;

    this._basename = path.basename(this.basename, this.extname);
    this._basename += extname;
    this._extname = extname;
  }

  get path () {
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

var inspectFile = function inspectFile (file) {
  ['path', 'cwd', 'base', 'dirname', 'basename', 'stem', 'extname'].forEach(function (key) {
    if (typeof file[key] == 'function') { return; }

    console.log('==', key +':', file[key]);
  });
  console.log('');
};

//var File = require('vinyl');
//var File = VinylPath;
//
//console.time('time');
//var file = new File({
//  path: 'D:\\repositories\\scaffront\\app\\frontend\\css\\css.scss'
//  //base: 'D:/repositories/scaffront\\app\\frontend'
//  //base: '\\app\\frontend\\'
//});
//
//inspectFile(file);
//
//file.base = '\\app\\frontend\\';
//inspectFile(file);
//
//file.dirname = '/../../\\bower_components\\frontend/styles\\css.scss';
//inspectFile(file);
//
//file.base = 'dist\\production\\';
//inspectFile(file);
//
//file.basename = '/..\\app\\frontend/..\\css.scss';
//inspectFile(file);
//
////file.dirname = '/../../\\bower_components\\frontend/styles\\css.scss';
////inspectFile(file);
//
////file.basename = 'app\\frontend\\css.scss';
////inspectFile(file);
//
//console.timeEnd('time');
//
//const fs = require('fs');
//console.log('exists', fs.existsSync(file.path));

//console.log('file', file);
//console.log('file', file.inspect());

module.exports = {
  convertToPosix,
  convertToWin32,
  isPathToDotFile,
  isPathToFile,
  withoutFile,
  normalize,
  isPathFromWin32Device,
  hasLeadingDotSlash,
  isRelative,
  isDot,
  isDotRelative,
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
