/**
 * It will be used in your frontend's scripts as a global variables
 * and in gulp tasks.
 */

const __ = require('./gulpfile.js/helpers');
const path = require('path');

const config = {
  NODE_ENV: process.env.NODE_ENV,
  mode:     process.env.NODE_ENV || 'development',
  isDev:    process.env.NODE_ENV == 'development' || !process.env.NODE_ENV,
  isProd:   process.env.NODE_ENV == 'production',
  debug:    process.env.DEBUG == 'true'
};


config.tasks = {};

config.tasks.src = 'app/frontend';
config.tasks.dest = (config.isDev) ? 'dest/frontend/development' : 'dest/frontend/production';

config.tasks.scripts = {
  src: __.glob(path.join(config.tasks.src, 'js'), ['*.js', '!_*.js']),
  dest: path.join(config.tasks.dest, 'js')
};

config.tasks.styles = {};
config.tasks.styles.css = {
  src: __.glob(path.join(config.tasks.src, 'css'), ['*.css', '!_*.css']),
  dest: path.join(config.tasks.dest, 'css'),
  watch: __.glob(path.join(config.tasks.src, 'css'), ['*.css'], true)
};
config.tasks.styles.scss = {
  src: __.glob(path.join(config.tasks.src, 'css'), ['*.scss', '!_*.scss']),
  dest: path.join(config.tasks.dest, 'css'),
  watch: __.glob(path.join(config.tasks.src, 'css'), ['*.scss'], true)
};


config.servers = {
  dev: {
    ui: false,
    open: false,
    //reloadDelay: 1000,
    //reloadDebounce: 1000,
    ghostMode: false,

    startPath: '/',
    port: 1313,
    server: {
      index: 'index.html',
      //directory: true,
      baseDir: config.tasks.dest
    }
  },
  prod: {
    ui: false,
    open: false,
    //reloadDelay: 1000,
    //reloadDebounce: 1000,
    ghostMode: false,

    startPath: '/',
    port: 13666,
    server: {
      index: 'index.html',
      //directory: true,
      baseDir: config.tasks.dest
    }
  }
};

console.log('config', config);

module.exports = config;
