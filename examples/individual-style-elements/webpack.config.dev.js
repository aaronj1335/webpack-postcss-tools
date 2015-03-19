var merge = require('lodash').merge;
var webpackConfig = require('./webpack.config.js');

module.exports = merge({}, webpackConfig, {
  resolve: {
    alias: {
      debug: './debug'
    }
  },

  output: {
    filename: 'index.js'
  },

  devtool: 'source-map'
});
