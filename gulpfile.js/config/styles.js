var _                = require('lodash'),
    __               = require('../helpers'),
    ImagesConfig     = require('./images').config,
    path             = require('path')
;


var config = {};

config.importPaths = {
  node_modules: __.getPackagePath(),
  bower_components: __.getBowerPath(),
  compass: __.getBowerPath('compass-mixins/lib'),
  sassToolkit: __.getBowerPath('sass-toolkit/stylesheets'),
  sassyButtons: __.getBowerPath('sassy-buttons'),
  sassyMaps: __.getBowerPath('sassy-maps/sass'),
  sassyLists: __.getBowerPath('SassyLists/dist'),
  singularity: __.getBowerPath('singularity/stylesheets'),
  singularityQuickSpanner: __.getBowerPath('singularity-quick-spanner/stylesheets'),
  breakpointSass: __.getBowerPath('breakpoint-sass/stylesheets'),
  breakpointSlicer: __.getBowerPath('breakpoint-slicer/stylesheets'),
  scaffrontStyles: __.getBowerPath('scaffront-styles/stylesheets'),
};

config.src = path.join(global.Builder.src, 'styles');
config.dest = path.join(global.Builder.dest, 'css');

config.extnames = {
  sass: ['sass', 'scss'],
  css:  ['css', '!_*.css']
};

config.cleanups = {
  build: __.getGlobPaths(config.dest, ['css', 'css.map', '!min.css', '!min.css.map'], true),
  dist:  __.getGlobPaths(config.dest, ['min.css', 'min.css.map'], true)
};

/**
 * @type {Copier}
 * @property {Copier} [sass]
 * @property {Copier} [css]
 */
config.copier = [{
  from: __.getGlobPaths(__.getBowerPath('fancybox/source'), ['gif', 'png', 'jpg']),
  to: path.join(ImagesConfig.src.libs, 'fancybox')
}, {
  from: __.getGlobPaths(__.getBowerPath('magnific-popup/src/css'), ['scss']),
  to: path.join(config.src, 'libs/magnific-popup')
}];

module.exports.config = config;