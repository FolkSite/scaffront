'use strict';

/**
 * It will be used in your frontend's scripts as a global variables
 * and in gulp tasks.
 */

const __   = require('./gulpfile.js/helpers');
const path = require('path');
const fs   = require('fs');

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

tasks.files      = {};
tasks.files.root = path.join(tasks.src, 'root');
tasks.files.dest  = tasks.dest;
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
 * @param {string} url
 * @param {{}} paths
 * @param {string} paths.entryFilepath
 * @param {string} paths.sourceFilepath
 * @returns {string}
 */
tasks.styles.resolveAssetsUrl = function (url, paths) {
  console.log('url', url);
  console.log('paths', paths);
  return url;
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
