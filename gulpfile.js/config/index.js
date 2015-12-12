var config = {};

global.Builder = {
  src: 'app',
  dest: 'dest'
};


config.server = require('./server');

config.styles = require('./styles');
config.fonts  = require('./fonts');
config.copier = require('./copier');
config.pages = require('./pages');
config.scripts = require('./scripts');
//config.images = require('./images');



module.exports = config;
