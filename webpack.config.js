'use strict';
const path = require("path");
const webpack = require("webpack");

module.exports = {
  mode: "production",
  devtool: 'source-map',
  entry: './public/client.js',
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'bundle.js'
  },
  resolve: {
    fallback: {
      fs: false,
      net: false,
      tls: false,
    }
  },
  plugins: [
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser'
    }),
  ],
  module: {
    rules: [
      {
        test: /JSONStream/,
        use: 'shebang-loader'
      },
      {
        test: /\.(glsl|frag|vert)$/,
        use: 'raw-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(glsl|frag|vert)$/,
        use: 'scarlett-glslify-loader',
        exclude: /node_modules/
      }
    ]
  }
};
