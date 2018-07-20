/**
 * Webpack config for running test suite
 */

const path = require('path');

module.exports = {
  entry: ['./tests/run.js'],
  output: {
    path: path.resolve(__dirname, 'tests/dist'),
    filename: 'bundle.js'
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      }
    ]
  },
  devtool: 'source-map',
  node: { // prevent require 'fs' module error https://github.com/webpack-contrib/css-loader/issues/447
    fs: 'empty'
  }
};