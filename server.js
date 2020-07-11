'use strict';
var express = require('express'); // eslint-disable-line node/no-missing-require
var app = express();
var dotenv = require('dotenv');
const { IamTokenManager } = require('ibm-watson/auth');

// bundle the code
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpack = require('webpack');
var webpackConfig = require('./webpack.config');

var compiler = webpack(webpackConfig);

// load environment properties from a .env file (local dev only)
// create a .env file containing SPEECH_TO_TEXT_API_KEY and SPEECH_TO_TEXT_URL
// or other variables
dotenv.load();

if (!process.env.SPEECH_TO_TEXT_API_KEY) {
  console.log('This example requires the SPEECH_TO_TEXT_API_KEY environment variable');
  process.exit(1);
}

const sttAuthenticator = new IamTokenManager({
  apikey: process.env.SPEECH_TO_TEXT_API_KEY || '{apikey}'
});

app.use(
  webpackDevMiddleware(compiler, {
    publicPath: '/' // Same as `output.publicPath` in most cases.
  })
);

app.use(express.static(__dirname + '/public'));
app.use(function(req, res, next) {
  res.header("Content-Security-Policy", "font-src 'self' data:"),
  next();
});

// speech to text token endpoint
app.use('/api/speech-to-text/token', function(req, res) {
  return sttAuthenticator
    .requestToken()
    .then(({ result }) => {
      res.json({ accessToken: result.access_token, url: process.env.SPEECH_TO_TEXT_URL });
    })
    .catch(console.error);
});

//var port = process.env.PORT || process.env.VCAP_APP_PORT || 5000;
//app.listen(port, function() {
//  console.log('Node app is running on port', port);
//});

// just export the app instead of starting up the server
module.exports = app;
