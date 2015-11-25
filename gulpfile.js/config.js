var _      = require('lodash'),
    Path   = require('path'),
    Extend = require('extend'),
    FS     = require('fs');


/**
 * @typedef {{}}                  BundleConfig
 * @property {String|string[]}    entry
 * @property {String}             [src]
 * @property {String}             [dest]
 * @property {String}             [outfile]
 * @property {{}}                 [options]
 * @property {Function}           [setup]
 * @property {Function}           [callback]
 * @property {boolean|{}}         [AutoPolyfiller]
 * @property {boolean|{}}         [Uglify]
 * @property {boolean}            [validated]
 * @property {null|*}             [bundler]
 */

/**
 * @property {BundleConfig} scripts.bundleDefaults
 * @property {String|String[]|BundleConfig|BundleConfig[]} scripts.bundles
 */
var config = {
  bower: {
    src: require('bower-directory').sync()
  },
  copy: [{
    src: 'app/scripts/vendor',
    dest: 'dist/js/vendor'
  }],
  scripts: require('./scripts'),

  BrowserSync: {
    instanceName: 'server',
    config: {
      open: false,
      startPath: '/html/',
      port: 666,
      server: {
        index: "index.html",
        directory: true,
        baseDir: 'dist'
      }
    },
    callback: function (err, bs) {

    }
  },

  handlebars: {
    src: 'app/hbs',
    dest: 'dist/html', // as a default for each task's type
    tasks: {
      data: {
        dest: 'dist/html',
        globalVarsDistFilename: 'globals.json'
      },
      render: {
        dest: 'dist/html'
      },
      compile: {
        dest: 'app/scripts/tpl'
      }
    },
    extnames: ['hbs', 'handlebars', 'hb'],
    globalVars: require('../app/hbs/globalVars'),
    /**
     * @param tplFile
     * @returns {{}|[]}
     */
    getTplData: function (tplFile) {
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
    },
    /**
     * @param {*} Handlebars
     */
    setupHandlebars: function (Handlebars) {
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
  }

};





module.exports = config;