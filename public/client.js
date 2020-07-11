'use strict';
// notes:
//
// * This file is bundled by webpack-dev-middleware into bundle.js
//
// * The require('watson-developer-cloud/language_translator/v2') could also be written as require('watson-developer-cloud').LanguageTranslatorV2,
//   but that version results in a much larger bundle size.
//
// * Tokens expire after 1 hour. This demo simply fetches a new one for each translation rather than keeping a fresh one.
//
// * fetch() is a modern version of XMLHttpRequest. A pollyfill is available for older browsers: https://github.com/github/fetch

// keep the bundle slim by only requiring the necessary modules
var recognizeMic = require('watson-speech/speech-to-text/recognize-microphone');

var updateText = require('./scarlett-game');

var btn = document.getElementById('activate-btn');
var input = document.getElementById('input');
var output = document.getElementById('output');

/**
 * @return {Promise<String>} returns a promise that resolves to a string token
 */
function getToken() {
  return fetch('/api/speech-to-text/token').then(resp => resp.json());
}

function recognizeSpeech(credentials) {
 
  var stream = recognizeMic({
    url: credentials.url,
    accessToken: credentials.accessToken,
    objectMode: true, // send objects instead of text
  });
  stream.on('data', (data) => {
    //console.log(data);
    var transcript = data.results[0].alternatives[0].transcript;
    output.innerHTML = transcript;
    updateText(transcript);
  });
  stream.on('error', function(err) {
    if (err) {
      output.innerHTML = err;
      return console.log(err);
    }
  });
}

btn.onclick = function() {
  getToken().then(recognizeSpeech);
};
