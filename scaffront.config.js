'use strict';

/**
 * It will be used in your frontend's scripts as a global variables
 * and in gulp tasks.
 */

const __        = require('./gulpfile.js/helpers');
const $         = require('gulp-load-plugins')();
const fs        = require('fs');
const isUrl     = require('is-url');
const path      = require('path');
const resolver  = require('./gulpfile.js/resolver');
const pathUp    = require('./gulpfile.js/path-up');
const VinylPath = pathUp.VinylPath;

let env = {
  NODE_ENV: process.env.NODE_ENV,
  mode:     process.env.NODE_ENV || 'development',
  isDev:    process.env.NODE_ENV == 'development' || !process.env.NODE_ENV,
  isProd:   process.env.NODE_ENV == 'production',
  debug:    process.env.DEBUG == 'true'
};

let tasks = {};

tasks.src  = 'app/frontend';
tasks.root = tasks.src;
tasks.dest = (env.isDev) ? 'dist/frontend/development' : 'dist/frontend/production';

var isUrlShouldBeIgnored = function isUrlShouldBeIgnored (url) {
  return url[0] === '#' ||
    url.indexOf('data:') === 0 ||
    isUrl(url);
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
tasks.assetResolver = function assetResolver (url, basePathname, entryPathname) {
  if (isUrlShouldBeIgnored(url)) { return url; }

  var result = {};
  var basedir = path.dirname(basePathname);
  var resolved = resolver(url, basedir);
  var vinylPathSrc = new VinylPath({
    base: tasks.root,
    path: resolved
  });
  var vinylPathDest = new VinylPath({
    base: tasks.root,
    path: vinylPathSrc.path
  });
  vinylPathDest.base = tasks.dest;

  result.url = path.join(vinylPathDest.dirname, vinylPathDest.basename);
  result.url = '/'+ pathUp.normalize(result.url, 'posix');

  result.src = vinylPathSrc.path;
  result.dest = vinylPathDest.path;

  return result;
};






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


/**
 * @param {string} resolvedUrl
 * @param {{}} paths
 * @param {string} paths.entryFile
 * @param {string} paths.sourceFile
 * @returns {string}
 */
tasks.styles.assetsUrlRebaser = function (resolvedUrl, paths) {
  var rebasedUrl = resolvedUrl;
  var root = __.preparePath(tasks.root, {startSlash: false, trailingSlash: false});
  var url = __.preparePath(resolvedUrl, {startSlash: false, trailingSlash: false});

  // если файл лежит внутри root-папки
  if (url.indexOf(root) === 0) {
    // то заменяем `root`-путь на `dist`-путь
    rebasedUrl = __.preparePath(path.relative(root, url), {startSlash: true, trailingSlash: false});
  } else {
    // а если нет (например `bower_components` из корня), то переносим этот путь как есть внутрь `dist`
    rebasedUrl = __.preparePath(url, {startSlash: true, trailingSlash: false});
  }
  // в конечном счёте, все файлы будут иметь абсолютные пути, относительно `dist`-директории
  return rebasedUrl;
};


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
    baseDir:   tasks.dest
  }
};

//console.log('config', config);

module.exports = {
  server: server,
  tasks:  tasks,
  env:    env,
  envs:   env
};
