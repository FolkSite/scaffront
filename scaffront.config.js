'use strict';

const _         = require('lodash');
const __        = require('./gulpfile.js/helpers');
const $         = require('gulp-load-plugins')();
const fs        = require('fs');
const isUrl     = require('is-url');
const path      = require('path');
const resolve   = require('resolve');
//const resolver  = require('./gulpfile.js/resolver');
const pathUp    = require('./gulpfile.js/path-up');
const VinylPath = pathUp.VinylPath;

let env = {
  NODE_ENV: process.env.NODE_ENV,
  mode:     process.env.NODE_ENV || 'development',
  isDev:    process.env.NODE_ENV == 'development' || !process.env.NODE_ENV,
  isProd:   process.env.NODE_ENV == 'production',
  debug:    process.env.DEBUG == 'true'
};

var root = 'app/frontend';
var dest = (env.isDev) ? 'dist/frontend/development' : 'dist/frontend/production';
var scripts = {};
scripts.root = path.join(root, 'js');
scripts.dest = path.join(dest, 'js');

let server = {
  ui:        false,
  open:      false,
  //reloadDelay: 1000,
  //reloadDebounce: 1000,
  ghostMode: false,

  startPath: '/',
  port:      (env.isDev) ? 1313 : 13666,
  server:    {
    index:     'index.html',
    directory: false,
    baseDir:   dest
  }
};

/**
 * Функция используется для резолва импортов в css/scss.
 * Должна вернуть *абсолютный* путь к файлу.
 *
 * @param {string} id
 * @param {string|{basedir: string}} basedir
 * @param {{}} [opts]
 * @param {string} [opts.basedir]
 */
var resolver = function resolver (id, basedir, opts) {
  if (_.isPlainObject(basedir)) {
    opts = basedir;
  } else {
    opts = (_.isPlainObject(opts)) ? opts : {};
    opts.basedir = basedir;
  }
  var paths = [].concat(opts.path || []);

  id = id.split('?')[0];

  var resolved = __.resolve('./'+ id, opts);
  if (!resolved) {
    resolved = __.resolve(id, opts);
  }

  if (!resolved) {
    if (paths.indexOf(opts.basedir) === -1) {
      paths.unshift(opts.basedir)
    }

    throw new Error([
      "Failed to find '" + id + "'",
      "in [ ",
      "    " + paths.join(",\n        "),
      "]"
    ].join("\n    "));
  }

  return resolved;
};

/**
 * @typedef {{}} resolvedAsset
 * @property {string} url
 * @property {string} [src]
 * @property {string} [dest]
 */

/**
 * Функция должна вернуть либо строку с новым урл,
 * либо (если файл надо переименовать или переложить в другое место)
 * объект с полями `url`, `src` и `dest`,
 * где `src` и `dest` - это *абсолютные* пути
 *
 * @param {string} url Урл как оно есть
 * @param {string} basePathname Файл, в котором этот урл встретился
 * @param {string} entryPathname Файл, в который будет проинклюден basePathname
 * @returns {string|resolvedAsset}
 */
var assetResolver = function assetResolver (url, basePathname, entryPathname) {
  if (isUrlShouldBeIgnored(url)) { return url; }

  var qs = '', hash = '';
  if (url.indexOf('?') >= 0) {
    qs = '?'+ url.split('?')[1];
  }

  if (!qs && url.indexOf('#') >= 0) {
    hash = '#'+ url.split('#')[1];
  }

  var result = {
    url: '',
    base: '',
    path: ''
  };
  var basedir = path.dirname(basePathname);
  var resolved = '';

  try {
    resolved = resolver(url, basedir);
  } catch (e) {}

  if (resolved) {
    var vinylPathSrc = new VinylPath({
      base: root,
      path: resolved
    });
    var vinylPathDest = new VinylPath({
      base: root,
      path: vinylPathSrc.path
    });
    vinylPathDest.base = dest;

    result.url = path.join(vinylPathDest.dirname, vinylPathDest.basename);
    result.url = '/'+ pathUp.normalize(result.url, 'posix') + qs + hash;

    result.src = vinylPathSrc.path;
    result.dest = vinylPathDest.path;
  }

  return result;
};

module.exports = {
  root,
  dest,
  scripts,
  server,
  resolver,
  assetResolver,
  env
};
