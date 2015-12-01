var webpack = require("webpack");

module.exports = {
  entry: "./app/scripts/js.js",
  resolve: {
    modulesDirectories: [
      "."
    ]
  },

  output: {
    path: "./dist/js/",
    filename: "js.js"
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: "babel-loader"
      }
    ]
  }

};