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


config.paths = {};

config.paths.root = 'app/frontend';
config.paths.dest = (config.isDev) ? 'dest/frontend/development' : 'dest/frontend/production';

config.paths.scripts = {
  src: __.glob(
    path.join(config.paths.root, 'js'),
    ['*.js', '!_*.js']
  ),
  dest: path.join(config.paths.dest, 'js')
};

module.exports = config;

console.log('config.paths', config.paths);
