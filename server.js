'use strict';
var express = require('express'); // eslint-disable-line node/no-missing-require
var app = express();
var dotenv = require('dotenv');
var watson = require('watson-developer-cloud');

// bundle the code
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpack = require('webpack');
var webpackConfig = require('./webpack.config');

var compiler = webpack(webpackConfig);


app.use(
  webpackDevMiddleware(compiler, {
    publicPath: '/' // Same as `output.publicPath` in most cases.
  })
);

app.use(express.static(__dirname + '/public'));
app.use(function(req, res, next) {
  res.header("Content-Security-Policy", "font-src 'self' data:")
  next();
});

// load environment properties from a .env file (local dev only)
// create a .env file containing SPEECH_TO_TEXT_USERNAME and SPEECH_TO_TEXT_PASSWORD
// or other variables
dotenv.load({ silent: true });

// For local development, specify the username and password or set env properties
var ltAuthService = new watson.AuthorizationV1({
  username: process.env.SPEECH_TO_TEXT_USERNAME || '<username>',
  password: process.env.SPEECH_TO_TEXT_PASSWORD || '<password>',
  url: watson.SpeechToTextV1.URL
});

app.use('/api/speech-to-text/token', function(req, res) {
  ltAuthService.getToken(function(err, token) {
    if (err) {
      console.log('Error retrieving token: ', err);
      return res.status(500).send('Error retrieving token');
    }
    res.send(token);
  });
});

var port = process.env.PORT || process.env.VCAP_APP_PORT || 5000;
app.listen(port, function() {
  console.log('Node app is running on port', port);
});
