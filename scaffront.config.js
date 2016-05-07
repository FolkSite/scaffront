'use strict';

/**
 * It will be used in your frontend's scripts as a global variables
 * and in gulp tasks.
 */

const __    = require('./gulpfile.js/helpers');
const $     = require('gulp-load-plugins')();
const fs    = require('fs');
const path  = require('path');
const isUrl = require('is-url');

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

function isUrlShouldBeIgnored (url) {
  return url[0] === "/" ||
    url[0] === "#" ||
    url.indexOf("data:") === 0 ||
    isUrl(url) ||
    /^[a-z]+:\/\//.test(url)
}

/**
 * Функция должна вернуть абсолютный путь к файлу, исходя из месторасположения файла, в котором он был найден.
 *
 * @param {string} module Урл, как оно есть
 * @param {string} basedir Месторасположение файла, в котором этот урл был найден
 * @param {string} entryBasedir Месторасположение файла, в который проинклюдится файл из basedir (необходимо для
 *   css/scss/html)
 * @return {string}
 */
tasks.resolver = function (module, basedir, entryBasedir) {
  if (isUrlShouldBeIgnored(module)) {
    return module;
  }

  let root = tasks.root;
  if (path.isAbsolute(module)) {
    root = __.preparePath(root, {startSlash: true, trailingSlash: false});
    //root = path.join('/', path.relative(process.cwd(), root));

    console.log('module.indexOf(root)', module.indexOf(root));

    //if (module.indexOf(root) === 0) {
    //  module = path.join(process.cwd(), root, module);
    //}
  } else {
    module = './'+ module;
  }

  module = module.split('?')[0]; // remove qs & hash

  return __.resolve(module, {basedir: basedir}) || '';
};

/**
 * Функция должна вернуть объект с новым урл и новым местоположением файла.
 * Здесь вы сами можете определить каким будет урл:
 *   - абсолютным;
 *   - относительно какой-то определённой директории веб-сервера (м.б. исходя из конфигурации выше)
 *   - или что-то ещё.
 * Используйте расширения, имена файлов и пути из `entryFilepath` и `baseFilepath` файлов, чтобы определить -
 * относительно чего надо вернуть новые значения.
 *
 * @param {string} assetUrl Урл, как оно есть
 * @param {string} assetFilepath Абсолютный путь к ассет-файлу, который пришёл из `tasks.resolver`-функции
 * @param {string} baseFilepath Файл, в котором этот урл был найден
 * @param {string} entryFilepath Файл, в который проинклюдится baseFilepath (необходимо для css/scss/html)
 * @returns {{url: string, path: string}|null}
 */
tasks.getAssetTarget = function (assetUrl, assetFilepath, baseFilepath, entryFilepath) {
  if (isUrlShouldBeIgnored(assetUrl)) {
    return null;
  }

  var root, dest, target = {
    url: assetUrl,
    path: assetFilepath
  };

  var assetUrlQs = assetUrl.match(/\?([^#]+)/);
  assetUrlQs = (assetUrlQs) ? '?'+ assetUrlQs[1] || '' : '';
  var assetUrlHash = assetUrl.match(/#(.+)/);
  assetUrlHash = (assetUrlHash) ? '#'+ assetUrlHash[1] || '' : '';

  assetUrl = assetUrl.split('?')[0];

  root = __.preparePath(tasks.root, {startSlash: false, trailingSlash: false});
  root = path.relative(process.cwd(), root);

  dest = __.preparePath(tasks.dest, {startSlash: false, trailingSlash: false});
  dest = path.relative(process.cwd(), dest);

  assetFilepath = path.relative(process.cwd(), assetFilepath);

  // в данном случае делаем все url'ы абсолютными относительно `dest`-папки (она же корень веб-сервера)

  // если файл находится внутри папки-"источника" исходников (`root`-папка)
  if (assetFilepath.indexOf(root) === 0) {
    // то перебазируем его в `dest`-папку
    target.path = path.join(process.cwd(), assetFilepath.replace(new RegExp(`^${root}`), dest));
    target.url = path.join('/', path.relative(dest, target.path));
  } else
  // если нужный файл уже лежит в `dest`-папке
  if (assetFilepath.indexOf(dest) === 0) {
    // то просто делаем url абсолютным относительно `dest`-папки
    target.path = assetFilepath;
    target.url = path.join('/', path.relative(dest, target.path));
  }
  // если файл не лежит ни в `root`, ни в `dest` (например в `bower_components` в корне всего проекта)
  else {
    // то переносим весь его путь (от `process.cwd()`) внутрь `dest`-папки
    target.path = path.join(process.cwd(), dest, path.relative(process.cwd(), assetFilepath));
    // url делаем соответствующим
    target.url = path.join('/', path.relative(dest, target.path));
  }

  target.url = `${target.url}${assetUrlQs}${assetUrlHash}`;

  return target;
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
