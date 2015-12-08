var config = {};

config.tmpPath = 'tmp';

config.server = require('./server');

//config._styles = require('./_styles');
config.styles = require('./styles');
config.fonts  = require('./fonts');
config.copier = require('./copier');
//config.images = require('./images');

//config.scripts = require('./scripts');
//config.templates = require('./templates');


module.exports = config;
