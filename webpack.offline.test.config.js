/**
 * Webpack config for running test suite in command line
 */

const path = require('path');
const glob = require('glob');

module.exports = {
  entry: glob.sync('./tests/*.test.js'),
  output: {
    path: path.resolve(__dirname, 'tests/dist'),
    filename: 'bundle.js'
  },
  mode: 'development',
  devtool: 'source-map'
};