var _    = require('lodash'),
    Path = require('path'),
    Extend = require('extend'),
    FS = require('fs');


/**
 * @property {String|string[]|{entry: String|string[], bundler: {options: {}, setup: Function, callback: Function}}|*[]} scripts.build.bundles May be a string, array of string, plain object or array of plain objects
 */
var config = {
  bower: {
    src: require('bower-directory').sync()
  },
  copy: [{
    src: 'app/scripts/vendor',
    dest: 'dist/js/vendor'
  }],
  scripts: {
    AutoPolyfiller: {
      browsers: ['last 3 version', 'ie 8', 'ie 9']
    },
    build: {
      src: 'app/scripts',
      dest: 'dist/js',
      bundles: [{
        entry: 'app/scripts/libs.js',
        dest: 'dist/js',
        outfile: 'libs.js',
        // options will be passed to Browserify constructor
        options: {

        },
        setup: function (bundler) {
          // можно подключать напрямую в script (классический принцип scope'а пождключаемых файлов). ignore просто выпиливает этот модуль из бандла
          bundler.ignore('jquery');
          // должен быть доступен из require
          //bundler.external('jquery');

          //bundler.add('app/scripts/app/js.js');
        },
        // callback will be passed to .bundle(callback)
        callback: function (err, buf) {}
      }, {
        entry: 'app/scripts/js.js',
        options: {

        },
        setup: function (bundler) {
          bundler.ignore('jquery');
          //return bundler; // optional
        },
        callback: function (err, buf) {}
      }]
    }
  },

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
    data: {
      dest: 'dist/html',
      globalVarsDistFilename: 'globals.json'
    },
    render: {
      dest: 'dist/html'
    },
    compile: {
      dest: 'app/scripts/tpl'
    },
    dest: {
      render: 'dist/html',
      compile: 'app/scripts/tpl',
      data: 'dist/html'
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
        raw: function (options) {
          /**
           * {{{{raw}}}}
           *   {{its-raw-text}}
           * {{{{/raw}}}}
           */
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