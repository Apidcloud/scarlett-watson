'use strict';

module.exports = {
  devtool: 'source-map',
  entry: './public/client.js',
  output: {
    filename: 'bundle.js'
  },
  // http://webpack.github.io/docs/configuration.html#node
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  },
  // Loader for Retrieve & Rank
  // Retrieve & Rank depends on solr-client, which depends on JSONStream, which starts with a shebang line, which
  // Webpack chokes on - this strips off that line.
  //
  // This isn't strictly needed because Retrieve & Rank doesn't support CORS, so there's no reason to include it in a
  // bundle. However, it's preserved here just to make things easy.
  //
  // See https://github.com/webpack/webpack/issues/2168 for more info
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
