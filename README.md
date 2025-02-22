# Scarlett Watson

<img src="WatsonSpeech+ScarlettMSDF.gif?raw=true" width="900px">

![with-coffee](https://img.shields.io/badge/made%20with-%E2%98%95%EF%B8%8F%20coffee-yellow.svg)
![with-water](https://img.shields.io/badge/made%20with-%F0%9F%92%A7%20water-blue.svg)
![with-love](https://img.shields.io/badge/made%20with-%F0%9F%92%8C-red.svg)

Live Demo:
- [Vercel](https://scarlett-watson.vercel.app/)

Should work even in smartphones. Tested with Firefox, Chromium-based browsers (Chrome and Brave), and Safari.

This example connects directly from your browser to the IBM Watson Cloud Speech to Text service and shows its output with [Scarlett's WebGL Framework](https://github.com/scarlettgamestudio/scarlett-framework) (MSDF) BMFont Text Rendering. 

## Basic Setup (without Speech to Text)

1. Install NodeJS (22.x)
2. Fork and clone the repo
3. Install Yarn globally with `$ npm i -g yarn` or download it at their [website](https://yarnpkg.com/en/docs/install)
4. `$ yarn` in the repo directory to install dependencies
5. `$ yarn build` to bundle code
5. `$ yarn start` to run express server
6. Open [localhost:4000](http://localhost:4000) in the browser

## IBM Watson Cloud Speech to Text

If you want to test IBM Watson's Speech to Text service, you'll need some additional steps:
1. Create an account over https://www.ibm.com/watson/developer/ and generate credentials to Speech to Text service
2. Create a `.env` file within the project folder and add the credentials through `SPEECH_TO_TEXT_API_KEY` and `SPEECH_TO_TEXT_URL` variables.

    Alternatively, you can go to `api/index.js` and replace the values accordingly.
3. `$ yarn start` to run express server
4. Open [localhost:4000](http://localhost:4000) in the browser
5. Clicking `Activate` button (when enabled) should now ask for your permission to use the microphone and render the output accordingly.

## Credits

- The animation effect is based on [this](https://github.com/Jam3/three-bmfont-text) repo by Mattdesl.
