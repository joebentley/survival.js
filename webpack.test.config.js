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
  node: { // https://github.com/webpack-contrib/css-loader/issues/447
    fs: 'empty'
  }
};