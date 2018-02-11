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

var recognizeMic = require('watson-speech/speech-to-text/recognize-microphone');
var updateText = require('./scarlett-game');

var btn = document.getElementById('analyze-btn');
var input = document.getElementById('input');
var output = document.getElementById('output');

/**
 * @return {Promise<String>} returns a promise that resolves to a string token
 */
function getToken() {
  return fetch('http://localhost:3000/api/speech-to-text/token').then(function(response) {
    return response.text();
  }); 
}

function recognizeSpeech(token) {
  var stream = recognizeMic({
    token: token,
    objectMode: true, // send objects instead of text
    extractResults: true, // convert {results: [{alternatives:[...]}], result_index: 0} to {alternatives: [...], index: 0}
    format: false // optional - performs basic formatting on the results such as capitals an periods
  });
  stream.on('data', (data) => {
    var transcript = data.alternatives[0].transcript;
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
