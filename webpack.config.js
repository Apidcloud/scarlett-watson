'use strict';
const path = require("path");

module.exports = {
  mode: "production",
  devtool: 'source-map',
  entry: './public/client.js',
  output: {
    path: path.resolve('public'),
    filename: 'bundle.js'
  },
  // http://webpack.github.io/docs/configuration.html#node
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  },
  module: {
    rules: [
      {
        test: /JSONStream/,
        use: 'shebang-loader'
      },
      {
        test: /\.(glsl|frag|vert)$/,
        loader: 'raw-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(glsl|frag|vert)$/,
        loader: 'scarlett-glslify-loader',
        exclude: /node_modules/
      }
    ]
  }
};
