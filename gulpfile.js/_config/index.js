var config = {};

config.tmpPath = 'tmp';

config.server = require('./server');

config.styles = require('./styles');
config.fonts  = require('./fonts');
config.copier = require('./copier');

//config.scripts = require('./scripts');
//config.templates = require('./templates');


module.exports = config;
