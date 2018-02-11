var DISPLAY_WIDTH = 1280,
  HALF_DISPLAY_WIDTH = DISPLAY_WIDTH / 2;
var DISPLAY_HEIGHT = 720,
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
  backgroundColor: Color.fromRGB(29, 25, 35)
});

GameManager.activeProjectPath = "http://localhost:3000/";

ContentLoader.loadAll({
  images: [
    { path: "assets/background.jpg", alias: "background" }
  ]
}).then(async function(result) {
  var images = result[0];
  var files = result[1];
  var audios = result[2];

  // needs to come before initializeTexDependencies
  game.changeScene(gameScene);
  game.setVirtualResolution(DISPLAY_WIDTH, DISPLAY_HEIGHT);

  await initializeTextDependencies("assets/fnt/arialbd.ttf");
});

gameScene.initialize = function() {
  backgroundTex = new Texture2D(ContentLoader.getImage("background"));

  var background = new Sprite({ texture: backgroundTex });
  background.setWrapMode(WrapMode.REPEAT);
};

async function initializeTextDependencies(fontPath) {
  text = new Text({
    fontFilePath: fontPath,
    text: "Lorem\r\nipsum\r\ndolore"
  });

  if (await text.setFontPathAsync(fontPath)) {
    text.transform.setPosition(-100, -180);
    text.setColor(Color.fromRGBA(232, 78, 64, 1.0));

    //var data = text.objectify();

    //console.log(data);

    //text.unload();

    //Text.restore(data).then(restoredText => {
    newText = text;
    newText.setDropShadowEnabled(false);
    newText.setStrokeEnabled(false);
    newText.setAlign(Text.AlignType.CENTER);
    //newText.setFontSize();

    //});
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
