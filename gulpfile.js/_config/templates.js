var _      = require('lodash'),
    __     = require('../helpers'),
    path   = require('path'),
    extend = require('extend'),
    gulp   = require('gulp'),
    fs     = require('fs');


module.exports = (function () {
  var config = {};
  var src = 'app/templates';

  config.data = {
    src: gulp.src(path.join(src, '**/*-data.js')),
    dest: 'dist/html'
  };

  config.globalData = require('../../app/templates/globals-data');

  config.render = {
    src: __.getGlobPaths(src, 'html', true),
    dest: 'dist/html',
    swig: {
      swigSetup: function (swigInstance) {},
      swigOptions: {
        //varControls: ['{{', '}}'],
        //tagControls: ['{%', '%}'],
        //cmtControls: ['{#', '#}'],
        cache: false,
        autoescape: true,
        // global template's data
        locals: {

        }
      },
      data: require('../../app/templates/globals-data'),
      mode: 'render'
    }
  };

  config.compile = {
    src: gulp.src(__.getGlobPaths(src, 'html')),
    dest: 'app/scripts/tpl',
    swig: {
      swigSetup: function (swigInstance) {},
      swigOptions: {
        varControls: ['{{', '}}'],
        tagControls: ['{%', '%}'],
        cmtControls: ['{#', '#}'],
        cache: false,
        autoescape: true,
        // global template's data
        locals: {

        }
      },
      mode: 'compile', // or 'compile'
      compileTemplate: 'module.exports = <%= template %>;'
    }
  };

  /**
   * @param tplFile
   * @returns {{}|[]}
   */
  config.getTplData = function (tplFile) {
    var dataFile,
        data = {},
        parsed = path.parse(tplFile.path),
        ext = '.js';

    parsed.name = parsed.name +'-data';
    parsed.ext = ext;
    parsed.base = parsed.name + ext;

    dataFile = path.format(parsed);

    if (dataFile && fs.existsSync(dataFile)) {
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
      var helpers = extend(require('hbs-helpers'), {
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