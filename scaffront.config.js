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

  var result = {};
  var basedir = path.dirname(basePathname);
  var resolved = resolver(url, basedir);
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

  return result;
};






var tasks = {};
tasks.src = root;
tasks.dest = root;

tasks.files      = {};
tasks.files.root = path.join(tasks.src, 'root');
tasks.files.dest = tasks.dest;
//tasks.files.src   = __.glob(tasks.files.root, ['*.*'], true);

/*
 хитрая хрень:
 - из рутовой директории матчит всё;
 - из директории скриптов матчит всё, кроме, собссна, скриптов;
 - из директории стилей матчит всё, кроме этих самых стилей.
 И скрипты, и стили, обрабатываются отдельными тасками.
 */
var filesGlob = [
  'app/frontend/root/**/*.*',
  'app/frontend/{js,css}/**/*.*',
  '!app/frontend/js/**/*.@(js)',
  '!app/frontend/css/**/*.@(css|scss)'
];
tasks.files.src   = filesGlob;
tasks.files.watch = filesGlob;
tasks.files.clean = __.glob(tasks.files.dest, ['*.*'], true);

tasks.scripts       = {};
tasks.scripts.root  = path.join(tasks.src, 'js');
tasks.scripts.dest  = path.join(tasks.dest, 'js');
tasks.scripts.src   = __.glob(tasks.scripts.root, ['*.js', '!_*.js']);
// tasks.scripts.watch - вотчер не нужен, потому что js-файлы вотчит webpack напрямую
tasks.scripts.clean = tasks.scripts.dest;

tasks.scripts.webpack = {
  output: {
    path: path.resolve('./dist/frontend/js'),
    publicPath: '/js/', // нужен для require.ensure
  },
  resolve: {
    root: [path.resolve('./app/frontend')]
  },

  // опции context и request будут подменяться в таске.
  // здесь они нужны, чтобы можно было запускать вебпак из консоли
  context: path.resolve('./app/frontend/'),
  entries: fs
   .readdirSync(path.join(path.resolve('./app/frontend/'), 'js'))
   .reduce(function (all, file) {
     if (/\.js$/.test(file) && !/^_/.test(file)) {
       all[path.basename(file, '.js')] = './js/'+ file;
     }

     return all;
   }, {})
};

tasks.styles       = {};
tasks.styles.root  = path.join(tasks.src, 'css');
tasks.styles.dest  = path.join(tasks.dest, 'css');
tasks.styles.clean = tasks.styles.dest;

tasks.styles.css        = {};
tasks.styles.css.src    = __.glob(tasks.styles.root, ['*.css', '!_*.css']);
tasks.styles.css.watch  = __.glob(tasks.styles.root, ['*.css'], true);
tasks.styles.scss       = {};
tasks.styles.scss.src   = __.glob(tasks.styles.root, ['*.scss', '!_*.scss']);
tasks.styles.scss.watch = __.glob(tasks.styles.root, ['*.scss'], true);

function isUrlShouldBeIgnored (url) {
  return !url ||
    url[0] === '#' ||
    url.indexOf('data:') === 0 ||
    isUrl(url);
}


module.exports = {
  tasks, // удалить
  root,
  dest,
  server,
  resolver,
  assetResolver,
  env,
  envs: env
};
