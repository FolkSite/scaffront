var config = {};

config.tmpPath = 'tmp';

config.server = require('./server');

//config._styles = require('./_styles');
config.styles = require('./_styles');
//config.styles = require('./styles');
config.fonts  = require('./fonts');
config.copier = require('./copier');
config.pages = require('./pages');
config.scripts = require('./scripts');
//config.images = require('./images');



module.exports = config;
