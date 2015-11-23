var Helpers            = require('../../helpers/functions.js'),
    config             = require('../config.js').handlebars,
    //browserSync        = require('browser-sync').get(require('../config.js').BrowserSync.instanceName),

    Gulp               = require('gulp'),
    Changed            = require('gulp-changed'),
    RunSequence        = require('run-sequence').use(Gulp),
    Plumber            = require('gulp-plumber'),
    Uglify             = require('gulp-uglify'),
    Del                = require('del'),
    Extend             = require('extend'),
    Rename             = require('gulp-rename'),
    Tap                = require('gulp-tap'),
    Gutil              = require('gulp-util'),
    Path               = require('path'),
    _                  = require('lodash'),

    MergeStream        = require('event-stream').merge,
    GulpFile           = require('gulp-file'),
    Data               = require('gulp-data'),
    Lazypipe           = require('lazypipe'),
    //Preprocess         = require('gulp-preprocess'),
    //Umd                = require('gulp-umd'),
    Handlebars         = require('handlebars'),
    HandlebarsRenderer = require('gulp-compile-handlebars'), // or gulp-handlebars-html && handlebars
    HandlebarsCompiler = require('gulp-handlebars'),
    GulpDefineModule   = require('gulp-define-module');

/**
 * Default config
 * @type {{src: string, dest: {render: string, data: string, compile: string}, extnames: string[], globalVars: {}, getTplData: Function, setupHandlebars: Function}}
 */
var defaults = {
  src: 'app/hbs',
  dest: {
    render: 'dist/html',
    data: 'dist/tpl/data',
    compile: 'dist/js/tpl'
  },
  extnames: ['hbs', 'handlebars', 'hb'],
  globalVars: {},
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
};

/**
 * Prepare & validate config
 */
config = Extend(true, defaults, config);

config.src = Helpers.preparePath({trailingSlash: true}, config.src);
config.dest.render = Helpers.preparePath({trailingSlash: true}, config.dest.render);
config.dest.data = Helpers.preparePath({trailingSlash: true}, config.dest.data);
config.dest.compile = Helpers.preparePath({trailingSlash: true}, config.dest.compile);

config.globalVars = (_.isPlainObject(config.globalVars)) ? config.globalVars : {};


/**
 * Gulp tasks
 */

Gulp.task('hbs:render', function () {
  Handlebars = HandlebarsRenderer.Handlebars;

  _.isFunction(config.setupHandlebars) && config.setupHandlebars(Handlebars);

  return Gulp.src(Helpers.getGlobPaths(config.src, config.extnames))
    .pipe(Plumber(Helpers.plumberErrorHandler))
    .pipe(Changed(config.dest.render, {extension: '.html'}))

    .pipe(Data(config.getTplData))
    .pipe(HandlebarsRenderer(config.globalVars, {
      batch: _.map(Helpers.getGlobPaths(config.src, false), function (source) {
        return Path.join(Path.resolve(process.cwd(), source), '/');
      })
    }))
    .pipe(Rename({extname: '.html'}))
    .pipe(Gulp.dest(config.dest.render));
});

Gulp.task('hbs:render:cleanup', function () {
  return Del(Helpers.getGlobPaths(config.dest.render, '.html'));
});


Gulp.task('hbs:compile', function () {

  _.isFunction(config.setupHandlebars) && config.setupHandlebars(Handlebars);

  return Gulp.src(Helpers.getGlobPaths(config.src, config.extnames))
    .pipe(Plumber(Helpers.plumberErrorHandler))
    .pipe(Changed(config.dest.compile, {extension: '.js'}))

    .pipe(Data(config.getTplData))
    .pipe(HandlebarsCompiler({
      handlebars: Handlebars
    }))
    .pipe(GulpDefineModule('node'))
    .pipe(Gulp.dest(config.dest.compile));
});

Gulp.task('hbs:compile:min', function () {

  var src = Helpers.getGlobPaths(config.dest.compile, '.js').concat(Helpers.getGlobPaths(config.dest.compile, '.min.js', true, true));

  return Gulp.src(src)
    .pipe(Plumber(Helpers.plumberErrorHandler))
    .pipe(Changed(config.dest.compile, {extension: '.min.js'}))
    .pipe(Uglify({
      //mangle: true,
      //output: {
      //  indent_start  : 0,     // start indentation on every line (only when `beautify`)
      //  indent_level  : 4,     // indentation level (only when `beautify`)
      //  quote_keys    : false, // quote all keys in object literals?
      //  space_colon   : true,  // add a space after colon signs?
      //  ascii_only    : false, // output ASCII-safe? (encodes Unicode characters as ASCII)
      //  inline_script : false, // escape "</script"?
      //  width         : 80,    // informative maximum line width (for beautified output)
      //  max_line_len  : 32000, // maximum line length (for non-beautified output)
      //  ie_proof      : true,  // output IE-safe code?
      //  beautify      : false, // beautify output?
      //  source_map    : null,  // output a source map
      //  bracketize    : false, // use brackets every time?
      //  comments      : false, // output comments?
      //  semicolons    : true,  // use semicolons to separate statements? (otherwise, newlines)
      //},
      //compress: {
      //  sequences     : true,  // join consecutive statemets with the “comma operator”
      //  properties    : true,  // optimize property access: a["foo"] → a.foo
      //  dead_code     : true,  // discard unreachable code
      //  drop_debugger : true,  // discard “debugger” statements
      //  unsafe        : false, // some unsafe optimizations (see below)
      //  conditionals  : true,  // optimize if-s and conditional expressions
      //  comparisons   : true,  // optimize comparisons
      //  evaluate      : true,  // evaluate constant expressions
      //  booleans      : true,  // optimize boolean expressions
      //  loops         : true,  // optimize loops
      //  unused        : true,  // drop unused variables/functions
      //  hoist_funs    : true,  // hoist function declarations
      //  hoist_vars    : false, // hoist variable declarations
      //  if_return     : true,  // optimize if-s followed by return/continue
      //  join_vars     : true,  // join var declarations
      //  cascade       : true,  // try to cascade `right` into `left` in sequences
      //  side_effects  : true,  // drop side-effect-free statements
      //  warnings      : true,  // warn about potentially dangerous optimizations/code
      //  global_defs   : {}     // global definitions
      //}
    }))
    .pipe(Rename(function (path) {
      if (!path.basename.match(/\.min$/)) {
        path.basename += '.min';
      }
    }))
    .pipe(Gulp.dest(config.dest.compile));
});

Gulp.task('hbs:compile:min:cleanup', function () {
  return Del(Helpers.getGlobPaths(config.dest.compile, '.min.js'));
});

Gulp.task('hbs:compile:cleanup', function () {
  return Del(Helpers.getGlobPaths(config.dest.compile, '.js'));
});


Gulp.task('hbs:data', function () {

  var globalDataStream = Lazypipe();
  if (config.data.globalVarsDistFilename) {
    var str = JSON.stringify(config.globalVars, null, 2);

    globalDataStream = GulpFile(config.data.globalVarsDistFilename, str, {src: true});
  }

  var allDataStream = Gulp.src(Helpers.getGlobPaths(config.src, config.extnames))
    .pipe(Plumber(Helpers.plumberErrorHandler))
    .pipe(Changed(config.dest.data, {extension: '.json'}))

    .pipe(Data(config.getTplData))
    .pipe(Tap(function (file) {
      var data = file.data;

      if (_.isPlainObject(data)) {
        file.contents = new Buffer(JSON.stringify(data, null, 2), 'utf8');
      }
    }));

  return MergeStream(globalDataStream, allDataStream)
    .pipe(Rename({
      extname: '.json'
    }))
    .pipe(Gulp.dest(config.dest.data));
});

Gulp.task('hbs:data:cleanup', function () {
  return Del(Helpers.getGlobPaths(config.dest.data, '.json'));
});





Gulp.task('hbs', ['hbs:build']);
Gulp.task('hbs:build', function (cb) {
  RunSequence(
    ['hbs:render', 'hbs:compile', 'hbs:data'],
    cb
  );
});

Gulp.task('hbs:dist', function (cb) {
  RunSequence(
    'hbs:cleanup',
    ['hbs:render', 'hbs:compile:min', 'hbs:data'],
    cb
  );
});


Gulp.task('hbs:cleanup', ['hbs:data:cleanup', 'hbs:compile:cleanup', 'hbs:render:cleanup'], function () {
  return Del([config.dest.data, config.dest.render, config.dest.compile]);
});


Gulp.task('hbs:watch', function (cb) {
  //RunSequence(
  //  ['jade:render', 'jade:compile:min', 'jade:data'],
  //  cb
  //);

  cb();
});

