var bowerConfig = require('./bower'),
    path        = require('path');

module.exports = (function () {
  var config = {};

  /**
   * @param {string} [directory]
   * @returns String
   */
  var getPackagePath = function (directory) {
    return path.join('node_modules', directory || '');
  };

  /**
   * @param {string} [directory]
   * @returns String
   */
  var getBowerPath = function (directory) {
    return path.join(bowerConfig.dirRelative, directory || '');
  };

  config.src = 'app/styles';

  config.sass = {
    includePaths: [
      getPackagePath(),
      getBowerPath(),
      getBowerPath('compass-mixins/lib'),
      getBowerPath('sass-toolkit/stylesheets'),
      getBowerPath('sassy-buttons'),
      getBowerPath('sassy-maps/sass'),
      getBowerPath('SassyLists/dist'),
      getBowerPath('singularity/stylesheets/singularitygs'),
      getBowerPath('singularity-quick-spanner/stylesheets'),
      getBowerPath('breakpoint-sass/stylesheets'),
      getBowerPath('breakpoint-slicer/stylesheets'),
    ]
  };

  return config;
})();