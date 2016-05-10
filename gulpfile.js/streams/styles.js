'use strict';

const $              = require('gulp-load-plugins')();
const _              = require('lodash');
const __             = require('../helpers');
const sass           = require('node-sass');
const path           = require('path');
const gulp           = require('gulp');
const isUrl          = require('is-url');
const config         = require('../../scaffront.config.js');
const extend         = require('extend');
const postcss        = require('postcss');
const resolve        = require('resolve');
const combiner       = require('stream-combiner2').obj;
const through        = require('through2').obj;
const applySourceMap = require('vinyl-sourcemaps-apply');
const resolver       = require('../resolver');

var streams = {};

streams.cssCompile = function cssCompile (options) {
  options = (_.isPlainObject(options)) ? options : {};

  var resolver      = __.resolverFactory(options.resolver || null);
  var assetResolver = __.assetResolverFactory(options.assetResolver || null);

  return combiner(
    // пропускаем каждую точку входа через свой поток-трансформер
    through(function(file, enc, callback) {
      if (file.isNull()) {
        return cb(null, file);
      }

      if (file.isStream()) {
        return handleError(callback)('Streams are not supported!');
      }

      var assets = {};
      var entryFilepath = file.path;

      var opts = { map: false };

      if (file.sourceMap) {
        opts.map = { annotation: false };
      }

      opts.from = file.path;
      opts.to = opts.to || file.path;

      postcss([
        // сперва сохраним все ассеты для точки входа
        require('postcss-url')({
          url: function (url) {
            var asset = assetResolver(url, entryFilepath, entryFilepath);
            if (asset.src && asset.dest) {
              assets[asset.src] = asset.dest;
            }

            return asset.url || url;
          }
        }),
        // импортируем вложенные css-ки
        require('postcss-import')({
          resolve: function (module, basedir, importOptions) {
            return resolver(module, basedir, {
              extensions: ['.css']
            });
          },
          // каждый импортированный файл тоже надо пропустить через postcss
          transform: function(css, filepath, _options) {
            return postcss([
              // теперь сохраним все ассеты из импортируемых файлов
              require('postcss-url')({
                url: function (url) {
                  var asset = assetResolver(url, filepath, entryFilepath);
                  if (asset.src && asset.dest) {
                    assets[asset.src] = asset.dest;
                  }

                  return asset.url || url;
                }
              })
            ])
              .process(css)
              .then(function(result) {
                return result.css;
              });
          }
        })
      ])
        .process(file.contents, opts)
        .then(function postcssHandleResult (result) {
          var map;
          var warnings = result.warnings().join('\n');

          file.contents = new Buffer(result.css);
          file.assets = assets;

          // Apply source map to the chain
          if (file.sourceMap) {
            map = result.map.toJSON();
            map.file = file.relative;
            map.sources = [].map.call(map.sources, function (source) {
              return path.join(path.dirname(file.relative), source);
            });
            applySourceMap(file, map);
          }

          if (warnings) {
            $.util.log('gulp-postcss:', file.relative + '\n' + warnings)
          }

          setImmediate(function () {
            callback(null, file)
          })
        }, handleError(callback));
    })
  );
};

streams.scssCompile = function scssCompile (options) {

  var assets = {};
  var resolver      = __.resolverFactory(options.resolver || null);
  var assetResolver = __.assetResolverFactory(options.assetResolver || null);

  return combiner(
    through(function(file, enc, callback) {
      var filepath = file.path.replace(/\\/g, '\\\\');
      var __filepath = `$__filepath: unquote("${filepath}");`;
      var contents = file.contents.toString().replace(/(@import\b.+?;)/gm, `$1\n${__filepath}`);

      contents = `
        ${__filepath}
        @function url($url: null) {
          @return __url($__filepath, $url);
        }
        ${contents}
      `;

      file.contents = Buffer.from(contents);
      file.scssExt = path.extname(file.path);
      callback(null, file);
    }),
    $.sass({
      precision: 10,
      quiet: true,
      importer: require('node-sass-import-once'),
      importOnce: {
        index: true,
        css: true,
        bower: false,
        /**
         * @param {string} filepath
         * @param {string} contents
         * @returns {string}
         */
        transformContent: function (filepath, contents) {
          filepath = filepath.replace(/\\/g, '\\\\');

          var __filepath = `$__filepath: unquote("${filepath}");`;
          contents = contents.replace(/(@import\b.+?;)/gm, '$1\n'+ __filepath);

          return `${__filepath}\n${contents}`;
        }
      },
      functions: {
        '__url($filepath, $url)': function(filepath, url, done) {
          var entryFilepath = this.options.file;
          url               = url.getValue();
          filepath          = filepath.getValue();

          assets[entryFilepath] = assets[entryFilepath] || {};

          if (url) {
            let asset = assetResolver(url, filepath, entryFilepath);
            url = asset.url || url;
            if (asset.src && asset.dest) {
              assets[entryFilepath][asset.src] = asset.dest;
            }
          }

          done(new sass.types.String('url("'+ url +'")'));
        }
      }
    }),
    through(function(file, enc, callback) {
      file.assets = assets[$.util.replaceExtension(file.path, file.scssExt)] || {};

      callback(null, file);
    })
  );
};







/*
 Переписать на scss: https://github.com/jonathantneal/postcss-short-position
 Что-то похожее на центрирование:
 https://github.com/jedmao/postcss-center

 https://github.com/postcss/postcss-import
 https://github.com/postcss/postcss-url
 https://github.com/postcss/postcss/blob/master/docs/writing-a-plugin.md

 Скаффолдер для плагинов под PostCSS:
 https://github.com/postcss/postcss-plugin-boilerplate

 Автоматические стайлгайды!
 https://github.com/morishitter/postcss-style-guide

 Форматирование стилей:
 https://github.com/ben-eb/perfectionist

 Сообщения об ошибках "компиляции", как в SCSS (body:before)
 https://github.com/postcss/postcss-browser-reporter
 require('postcss-browser-reporter')({
 selector: 'html:before'
 }),


 Ещё один месседжер:
 https://github.com/postcss/postcss-reporter

 Отфильтровывает файлы из потока и применяет плагин:
 https://github.com/tsm91/postcss-filter-stream
 filterStream('**\/css/vendor/**', colorguard()),

 H5BP'ые in-/visible хелперы:
 https://github.com/lukelarsen/postcss-hidden

 http://e-planet.ru/company/blog/poleznye-snippety-dlja-sass.html
 https://www.npmjs.com/package/image-size

 Ассеты и шрифты:
 http://postcss.parts/tag/images
 http://postcss.parts/tag/svg
 https://github.com/justim/postcss-svg-fallback
 https://github.com/jonathantneal/postcss-font-magician
 https://github.com/geut/postcss-copy

 https://github.com/tars/tars-scss
 https://toster.ru/q/256261
 https://github.com/glebmachine/postcss-cachebuster
 */


var browsers = ['last 4 versions', 'ie 8-9', '> 2%'];
var postCssTasksForAnyStyles = $.postcss([
  require('postcss-pseudo-content-insert'),
  require('postcss-focus'),
  require('postcss-single-charset')(),
  require('postcss-easings')({
    easings: require('postcss-easings').easings
  })
]);
var postCssProcessorsFallbacks = [
  require('postcss-color-rgba-fallback')({
    properties: ['background-color', 'background', 'color', 'border', 'border-color', 'outline', 'outline-color'],
    oldie: true,
    backgroundColor: [255, 255, 255]
  }),
  require('postcss-gradient-transparency-fix'),
  require('postcss-single-charset')(),
  require('postcss-will-change'),
  require('pixrem')({
    // `pixrem` tries to get the root font-size from CSS (html or :root) and overrides this option
    //rootValue: 16px,
    replace: false,
    atrules: true,
    browsers: browsers,
    unitPrecision: 10
  }),
  require('postcss-pseudoelements')({
    selectors: ['before','after','first-letter','first-line']
  }),
  require('postcss-vmin'),
  require('postcss-opacity'),
  require('postcss-filter-gradient'),
  require('postcss-input-style'),
  require('postcss-unroot')({
    method: 'copy'
  }),
  //require('postcss-svg-fallback')({
  //  // base path for the images found in the css
  //  // this is most likely the path to the css file you're processing
  //  // not setting this option might lead to unexpected behavior
  //  basePath: '',
  //
  //  // destination for the generated SVGs
  //  // this is most likely the path to where the generated css file is outputted
  //  // not setting this option might lead to unexpected behavior
  //  dest: '',
  //
  //  // selector that gets prefixed to selector
  //  fallbackSelector: '.no-svg',
  //
  //  // when `true` only the css is changed (no new files created)
  //  disableConvert: false,
  //}),
  // с `postcss-unmq` надо разобраться на тему -
  // как засунуть получившиеся стили в поток отдельным файлом
  //require('postcss-unmq')({
  //  // these are already the default options
  //  type: 'screen',
  //  width: 1024,
  //  height: 768,
  //  resolution: '1dppx',
  //  color: 3
  //}),
];
var postCssProcessorsDist = [
  require('cssnano')({
    autoprefixer: {
      browsers: browsers,
      cascade:  false,
      remove:   true
    },
    calc: {},
    colormin: {legacy : false},
    convertValues: {length: false},
    discardComments: {},
    discardDuplicates: {},
    discardEmpty: {},
    discardUnused: {},
    filterPlugins: {},
    mergeIdents: {},
    mergeLonghand: {},
    mergeRules: {},
    minifyFontValues: {},
    minifyGradients: {},
    minifySelectors: {},
    normalizeCharset: {},
    normalizeUrl: {},
    orderedValues: {},
    reduceIdents: {},
    reduceTransforms: {},
    svgo: {},
    uniqueSelectors: {},
    zindex: {}
  })
];

streams.dist = function (options) {
  options = (_.isPlainObject(options)) ? options : {};


};

function handleError (cb) {
  return function (error) {
    var errorOptions = { fileName: file.path };
    if (error.name === 'CssSyntaxError') {
      error = error.message + error.showSourceCode();
      errorOptions.showStack = false;
    }
    // Prevent stream’s unhandled exception from
    // being suppressed by Promise
    cb && setImmediate(function () {
      cb(new $.util.PluginError('gulp-postcss', error));
    });
  };
}

module.exports = streams;
