# Scarlett Watson

<img src="WatsonSpeech+ScarlettMSDF.gif?raw=true" width="900px">

![with-coffee](https://img.shields.io/badge/made%20with-%E2%98%95%EF%B8%8F%20coffee-yellow.svg)
![with-water](https://img.shields.io/badge/made%20with-%F0%9F%92%A7%20water-blue.svg)
![with-love](https://img.shields.io/badge/made%20with-%F0%9F%92%8C-red.svg)

Live Demos:
- [Zeit](https://scarlett-watson.now.sh/)
- [Heroku](https://scarlett-watson.herokuapp.com/) - might be unavaible due to free plan's 30min inactivity

Both should work even in smartphones. Tested with Firefox and Google Chrome. Safari doesn't seem to handle the microphone permissions very well though.

This example connects directly from your browser to the IBM Watson Cloud Speech to Text service and shows its output with [Scarlett's WebGL Framework](https://github.com/scarlettgamestudio/scarlett-framework) (MSDF) BMFont Text Rendering. 

## Basic Setup (without Speech to Text)

1. Install NodeJS (8.x or higher is recommended)
2. Fork and clone the repo
3. Install Yarn globally with `$ npm i -g yarn` or download it at their [website](https://yarnpkg.com/en/docs/install)
4. `$ yarn` in the repo directory to install dependencies
5. `$ yarn start` to run express server
6. Open [localhost:5000](http://localhost:5000) in the browser

## IBM Watson Cloud Speech to Text

If you want to test IBM Watson's Speech to Text service, you'll need some additional steps:
1. Create an account over https://www.ibm.com/watson/developer/ and generate credentials to Speec to Text service
2. Create a `.env` file within the project folder and add the credentials through `SPEECH_TO_TEXT_USERNAME` and `SPEECH_TO_TEXT_PASSWORD` variables. 

    Alternatively, you can go to `server.js` lines `33-34` and replace `<username>` and `<password>` accordingly.
3. `$ yarn start` to run express server
4. Open [localhost:5000](http://localhost:5000) in the browser
5. Clicking `Analyze` button should now ask for your permission to use the microphone and render the output accordingly

## Heroku

You can also use Heroku to run the app, and setting it up is pretty straightforward:
1. Create an account over [Heroku](https://www.heroku.com)
2. Download and install Heroku's [CLI](https://devcenter.heroku.com/articles/heroku-cli#download-and-install)
3. Run `$ heroku auth:login` and enter your account credentials
4. Create an heroku app `$ heroku create`
5. Run it locally `$ heroku local web`
6. Open the app with `$ heroku open` or [localhost:5000](http://localhost:5000) in the browser

## Credits

- The animation effect is based on [this](https://github.com/Jam3/three-bmfont-text) repo by Mattdesl.
