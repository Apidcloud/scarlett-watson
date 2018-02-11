var CustomMSDFShader = require("./customMSDFShader");

var DISPLAY_WIDTH = 1920,
  HALF_DISPLAY_WIDTH = DISPLAY_WIDTH / 2;
var DISPLAY_HEIGHT = 500,
  HALF_DISPLAY_HEIGHT = DISPLAY_HEIGHT / 2;

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

GameManager.activeProjectPath = "http://localhost:3000/";

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

  await initializeTextDependencies("assets/fnt/Roboto-Regular.ttf");
});

gameScene.initialize = function() {
  //backgroundTex = new Texture2D(ContentLoader.getImage("background"));

  //var background = new Sprite({ texture: backgroundTex });
  //gameScene.addGameObject(background);
};

async function initializeTextDependencies(fontPath) {
  text = new Text({
    fontFilePath: fontPath,
    text: "Lorem\r\nipsum\r\ndolore",
    shader: new CustomMSDFShader()
  });

  if (await text.setFontPathAsync(fontPath)) {
    text.transform.setPosition(-125, -180);
    //text.setColor(Color.fromHex("#C36891FF"));
    text.setColor(Color.fromHex("#F74356FF"));
    newText = text;
    //newText.getStroke().setColor(Color.fromRGBA(40, 1, 1, 1.0));
    //newText.getStroke().setSize(6.0);
    newText.setStrokeEnabled(false);
    newText.setDropShadowEnabled(false);
    newText.setAlign(Text.AlignType.CENTER);
    newText.setGamma(4.0);
    newText.setFontSize(110);
  }
}

gameScene.lateUpdate = function(delta) {
  if (Keyboard.isKeyDown(Keys.Add)) {
    this._camera.zoom -= 0.01;
  } else if (Keyboard.isKeyDown(Keys.Subtract)) {
    this._camera.zoom += 0.01;
  }
};

gameScene.lateRender = function(delta) {
  if (newText) {
    newText.render(delta, this._spriteBatch);
  }
};

module.exports = function updateText(str) {
  newText.setText(str);
}
