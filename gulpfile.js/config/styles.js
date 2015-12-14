var _                = require('lodash'),
    __               = require('../helpers'),
    ImagesConfig     = require('./images').config,
    path             = require('path')
;


var config = {};

config.importPaths = {
  'compass':                        __.getBowerPath('compass-mixins/lib'),
  'toolkit':                        __.getBowerPath('sass-toolkit/stylesheets'),
  'sassybuttons':                   __.getBowerPath('sassy-buttons'),
  'memo':                           __.getBowerPath('sassy-maps/sass'),
  'sassy-maps':                     __.getBowerPath('sassy-maps/sass'),
  'SassyLists':                     __.getBowerPath('SassyLists/dist'),
  'singularitygs':                  __.getBowerPath('singularity/stylesheets'),
  'singularity-quick-spanner':      __.getBowerPath('singularity-quick-spanner/stylesheets'),
  'breakpoint':                     __.getBowerPath('breakpoint-sass/stylesheets'),
  'breakpoint-slicer':              __.getBowerPath('breakpoint-slicer/stylesheets'),
  'sass-units-transform':           __.getBowerPath('sass-units-transform'),
  'support-for':                    __.getBowerPath('support-for/sass'),
  'normalize-scss':                 __.getBowerPath('normalize-scss/sass'),
  'sassdash':                       __.getBowerPath('sassdash/scss'),
  'sassy-validation':               __.getBowerPath('sassy-validation/stylesheets'),
  'modernizr-mixin':                __.getBowerPath('modernizr-mixin/stylesheets'),
  'scaffront-styles':               __.getBowerPath('scaffront-styles/stylesheets'),
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
//  from: __.getGlobPaths(__.getBowerPath('fancybox/source'), ['gif', 'png', 'jpg']),
//  to: path.join(ImagesConfig.src.libs, 'fancybox')
//}, {
//  from: __.getGlobPaths(__.getBowerPath('magnific-popup/src/css'), ['scss']),
//  to: path.join(config.src, 'libs/magnific-popup')
}];

module.exports.config = config;