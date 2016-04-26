'use strict';

/**
 * It will be used in your frontend's scripts as a global variables
 * and in gulp tasks.
 */

const __   = require('./gulpfile.js/helpers');
const path = require('path');

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

tasks.scripts       = {};
tasks.scripts.root  = path.join(tasks.src, 'js');
tasks.scripts.dest  = path.join(tasks.dest, 'js');
tasks.scripts.src   = __.glob(tasks.scripts.root, ['*.js', '!_*.js']);
// tasks.scripts.watch - вотчер не нужен, потому что js-файлы вотчит webpack напрямую
tasks.scripts.clean = tasks.scripts.dest;

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

tasks.files      = {};
tasks.files.root = path.join(tasks.src, 'root');
tasks.files.dest  = tasks.dest;
// todo копировать также всё из js/css, кроме .js/.css/.scss
tasks.files.src   = __.glob(tasks.files.root, ['*.*'], true);
//tasks.files.src   = [
//  path.join(tasks.root, '{js/}')
//];
tasks.files.watch = __.glob(tasks.files.root, ['*.*'], true);
// todo исключать пути, а не расширения
tasks.files.clean = __.glob(tasks.files.dest, ['*.*', '!*.js', '!*.css'], true);

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
