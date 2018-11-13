var CustomMSDFShader = require("./shaders/customMSDFShader");

var DISPLAY_WIDTH = 1920;
var DISPLAY_HEIGHT = 500;

const body = document.querySelector('body');
body.addEventListener('touchstart', (ev) => ev.preventDefault());
body.addEventListener('contextmenu', (ev) => ev.preventDefault());

const canvas = document.querySelector('canvas');
canvas.addEventListener('touchstart', (ev) => ev.preventDefault());
canvas.addEventListener('contextmenu', (ev) => ev.preventDefault());

var Game = SC.Game;
var GameScene = SC.GameScene;
var ContentLoader = SC.ContentLoader;
var GameManager = SC.GameManager;
var Sprite = SC.Sprite;
var WrapMode = SC.WrapMode;
var Texture2D = SC.Texture2D;
var Text = SC.Text;
var Color = SC.Color;
var Keyboard = SC.Keyboard;
var Keys = SC.Keys;
var Vector2 = SC.Vector2;
var MathHelper = SC.MathHelper;
var BMFontParser = SC.BMFontParser;
var FileContext = SC.FileContext;
var FontLoader = SC.FontLoader;
var Path = SC.Path;

var game = new Game({ target: "canvas" });
var text;
var textTexture;
var newText;

game.init();

var gameScene = new GameScene({
  name: "my game scene 1",
  game: game,
  //backgroundColor: Color.fromHex("#403F63FF")
  backgroundColor: Color.fromHex("#8DAABAFF")
});

GameManager.activeProjectPath = "/";

ContentLoader.loadAll({
  images: [
    { path: "assets/triangle-background.png", alias: "background" }
  ]
}).then(async function(result) {
  var images = result[0];
  var files = result[1];
  var audios = result[2];

  // needs to come before initializeTexDependencies
  game.changeScene(gameScene);
  game.setVirtualResolution(DISPLAY_WIDTH, DISPLAY_HEIGHT);

  await initializeTextDependencies("assets/fnt/OpenSans-Regular.ttf");
});

var gl = null;

gameScene.initialize = function() {
  gl = SC.GameManager.renderContext.getContext();
  
};

async function initializeTextDependencies(fontPath) {
  text = new Text({
    fontFilePath: fontPath,
    text: "How cool is this?",
    shader: new CustomMSDFShader()
  });

  if (await text.setFontPathAsync(fontPath)) {
    text.transform.setPosition(-390, -130);
    //text.setColor(Color.fromHex("#C36891FF"));
    text.setColor(Color.fromHex("#5b1928FF"));
    newText = text;
    //newText.getStroke().setColor(Color.fromRGBA(40, 1, 1, 1.0));
    //newText.getStroke().setSize(6.0);
    newText.setStrokeEnabled(false);
    newText.setDropShadowEnabled(false);
    newText.setAlign(Text.AlignType.CENTER);
    newText.setGamma(4.0);
    newText.setFontSize(110);
  }
};

gameScene.lateUpdate = function(delta) {
  if (Keyboard.isKeyDown(Keys.Add)) {
    this._camera.zoom -= 0.01;
  } else if (Keyboard.isKeyDown(Keys.Subtract)) {
    this._camera.zoom += 0.01;
  }
};

var time = 0;
var duration = 5;
var step = 1;
var fixed = [
  "How cool is this?",
  "Using IBM Watson's Cloud Speech to Text service",
  "and displaying its result with Scarlett's Framework MSDF Font Rendering",
  "Click on the 'Activate' button and speak to your microphone!"
];

var btn = document.getElementById('activate-btn');

function nextStep(step){
  if (step >= fixed.length || step < 0){
    return -1;
  } else if (step === fixed.length - 1) {
    btn.disabled = false;
  }

  newText.setText(fixed[step++]);
  return step;
}

gameScene.render = function(delta) {
  if (!newText) {
    return;
  }

  time += delta;
  var iGlobalTime = time;
  var animate = time / duration;
  if (time > duration){
    time = 0;
    step = nextStep(step);
  }

  gl.uniform1f(newText.getShader().uniforms.iGlobalTime._location, iGlobalTime);
  gl.uniform1f(newText.getShader().uniforms.animate._location, animate);

  newText.render(delta, this._spriteBatch);
};

module.exports = function updateText(str) {
  newText.setText(str);
}
