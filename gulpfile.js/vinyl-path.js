'use strict';

const path = require('path');

let defaults = {
  cwd:      process.cwd(),
  base:     '',
  dirname:  '',
  basename: '',
  extname:  ''
};

/**
 * @param {string} dirname
 * @param {string} cwd
 * @returns {string}
 */
let getRelativeFromCwd = function getRelativeFromCwd (dirname, cwd) {
  var isWin = process.platform == 'win32';
  var sep = path.sep;

  cwd     = path.dirname(cwd);
  dirname = path.dirname(dirname);

  var cwdIsRelative     = !path.isAbsolute(cwd);
  var dirnameIsRelative = !path.isAbsolute(dirname);

  var cwdAbsolute, cwdRelative;
  var dirnameAbsolute, dirnameRelative;

  if (cwdIsRelative) {
    cwdAbsolute = path.join(sep, cwd);
    cwdRelative = cwd;
  } else {
    cwdAbsolute = cwd;
    cwdRelative = cwd.slice(sep.length);
  }

  if (dirnameIsRelative) {
    dirnameAbsolute = path.join(sep, dirname);
    dirnameRelative = dirname;
  } else {
    dirnameAbsolute = dirname;
    dirnameRelative = dirname.slice(sep.length);
  }

  cwdAbsolute = path.dirname(cwdAbsolute);
  dirnameAbsolute = path.dirname(dirnameAbsolute);

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

  if (dirnameAbsolute.indexOf(cwdAbsolute) === 0) {
    dirname = dirnameAbsolute.slice(cwdAbsolute.length);
  } else {
    //dirname = path.resolve(cwdAbsolute, dirnameRelative);
  }

  let cwdForCompare, dirnameForCompare;
  let cwdIsAbsolute, dirnameIsAbsolute;

  cwdIsAbsolute     = path.isAbsolute(cwd);
  dirnameIsAbsolute = path.isAbsolute(dirname);
  if (isWin) {
    if (cwdIsAbsolute && !/^[a-z]:/i.test(cwd)) {
      cwdIsAbsolute = false;
      cwd = cwd.slice(sep.length);
    }

    if (dirnameIsAbsolute && !/^[a-z]:/i.test(dirname)) {
      dirnameIsAbsolute = false;
      dirname = dirname.slice(sep.length);
    }
  } else {

  }

  if (cwdIsAbsolute && dirnameIsAbsolute) {

  } else
  if (cwdIsAbsolute && !dirnameIsAbsolute) {

  } else
  if (!cwdIsAbsolute && dirnameIsAbsolute) {

  } else
  if (!cwdIsAbsolute && !dirnameIsAbsolute) {

  }





  if (!isWin) {

  } else {

  }



  if (!path.isAbsolute(dirname)) {
    if (!isWin) {

    }
  } else {
    if (isWin) {

    } else {

    }
  }



  if (dirname.indexOf(cwd) !== 0) {
    dirname = path.join(cwd, dirname);
  }
  dirname = path.relative(cwd, dirname);

  return dirname;
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

  var ext = path.extname(_path);

  this.basename = path.basename(_path);
  this.extname = ext;
};

class VirtualPath {
  constructor (_path, opts) {
    opts = opts || {};

    this.isWin     = process.platform == 'win32';
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

module.exports = VirtualPath;