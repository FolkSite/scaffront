var _      = require('lodash'),
    __     = require('../helpers'),
    Path   = require('path'),
    Extend = require('extend'),
    Gulp   = require('gulp'),
    FS     = require('fs');

var test;
test = Gulp.src(__.getGlobPaths('app/hbs', ['hbs', 'handlebars', 'hb']));


module.exports = (function () {
  var config = {};

  config.globalVars = require('../../app/templates/globalData');

  config.src = Gulp.src(__.getGlobPaths('app/hbs', ['hbs', 'handlebars', 'hb']));

    // as a default for each task's type
  config.dest = 'dist/html';

  config.data = {
    dest: 'dist/html',
    globalVarsDistFilename: 'globals.json'
  };
  config.render = {
    dest: 'dist/html'
  };
  config.compile = {
    dest: 'app/scripts/tpl'
  };

  /**
   * @param tplFile
   * @returns {{}|[]}
   */
  config.getTplData = function (tplFile) {
    var dataFile,
        data = {},
        parsed = Path.parse(tplFile.path),
        ext = '.js';

    parsed.name = parsed.name +'-data';
    parsed.ext = ext;
    parsed.base = parsed.name + ext;

    dataFile = Path.format(parsed);

    if (dataFile && FS.existsSync(dataFile)) {
      data = require(dataFile);

      if (!_.isPlainObject(data)) {
        try {
          data = JSON.parse(data);
          data = data || {}; // prevent null
        } catch (e) { data = {}; }
      }
    }

    return data;
  };

  // Handlebars config
  config.handlebars = {
    /**
     * @param {*} Handlebars
     */
    setup: function (Handlebars) {
      var helpers = Extend(require('hbs-helpers'), {
        moment: require('helper-moment'),
        /**
         * {{{{raw}}}}
         *   {{its-raw-text}}
         * {{{{/raw}}}}
         */
        raw: function (options) {
          return options.fn();
        },
        upcase: function(s) {
          return s.toUpperCase();
        }
      });

      var partials = {};

      var HandlebarsHelpers = require('handlebars-helpers');
      HandlebarsHelpers.register(Handlebars, {marked: {}});

      var HandlebarsLayouts = require('handlebars-layouts');
      HandlebarsLayouts.register(Handlebars);

      _.each(helpers, function (helper, key) {
        Handlebars.registerHelper(key, helper);
      });
      _.each(partials, function (partial, key) {
        Handlebars.registerPartial(key, partial);
      });
    }
  };

  return config;
})();