var config = {};

config.tmpPath = 'tmp';

config.server = require('./server');

//config._styles = require('./_styles');
config.styles = require('./styles');
config.fonts  = require('./fonts');
config.copier = require('./copier');
config.templates = require('./templates');
//config.images = require('./images');

//config.scripts = require('./scripts');


module.exports = config;
