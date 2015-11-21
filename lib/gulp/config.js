var _    = require('lodash'),
    Path = require('path'),
    FS = require('fs');


var config = {
  bower: {
    src: require('bower-directory').sync()
  },
  scripts: {
    copy: {
      src: 'app/scripts/vendor',
      dest: 'dist/js/vendor'
    },
    build: {
      src: 'app/scripts',
      dest: 'dist/js'
    }
  },

  BrowserSync: {
    instanceName: 'server',
    config: {
      port: 666,
      server: {
        baseDir: 'dist'
      }
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
    globalVars: require('../../app/hbs/globalVars'),
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
      var helpers = {
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
      };

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