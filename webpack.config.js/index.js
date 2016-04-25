'use strict';

const envs = require('../scaffront.env.js');
const path = require('path');
const webpack = require('webpack');

//console.log(path.resolve('./app/frontend'));

const config = [{
  context: path.resolve('./app/frontend'),
  entry: {
    common: ['./js/common.js'],
    js: './js/js.js',
    components: './js/components.js'
  },
  output: {
    path: path.resolve('./dist/frontend/js'),
    filename: '[name].js',
    library: '[name]',
    chunkFilename: '[id].js',
    publicPath: '/js/' // trailing slash is required!
  },

  resolve: {
    modulesDirectories: ['node_modules', 'bower_components'],
    extensions: ['', '.js'],
    root: [
      path.resolve('./app/frontend')
    ]
  },

  externals: {
    lodash: '_'
  },

  //watch: (envs.isProd),
  //watchOptions: {
  //  aggregateTimeout: 300
  //},

  devtool: (!envs.isProd) ? '#inline-source-map' : '#source-map',

  plugins: [
    new webpack.NoErrorsPlugin(),
    new webpack.EnvironmentPlugin(Object.keys(process.env)),
    new webpack.DefinePlugin(Object.keys(envs).reduce((_envs, env) => {
      _envs[env] = JSON.stringify(envs[env]);

      return _envs;
    }, {})),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common',
      minChunks: 2
    })
  ],

  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /(node_modules|bower_components)/,
      loader: 'babel',
      query: {
        presets: ['es2015'],
        plugins: [
          ['transform-runtime', {
            "polyfill": false,
            "regenerator": true
          }]
        ]
      },
    }],
    noParse: [
      /angular\/angular.js/,
      // /jquery/,
    ]
  },
  resolveLoader: {
    modulesDirectories: ['node_modules'],
    moduleTemplates: ['*-loader', '*'],
    extensions: ['', '.js']
  },
}];


if (envs.isProd) {
  config.forEach(function (item) {
    item.plugins.push(
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false,
          drop_console: true,
          unsafe: true
        }
      })
    );
  });
}

module.exports = config;
