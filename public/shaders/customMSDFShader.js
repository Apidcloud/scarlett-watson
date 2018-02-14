const frag = require("./customFx.frag");

const shaderContent = {
  vertex: `
    attribute vec2 aPos;
    attribute vec2 aTexCoord;

    uniform mat4 uMatrix;
    uniform mat4 uTransform;
    uniform vec2 uTexSize;

    varying vec2 vTexCoord;

    void main() {
      gl_Position = uMatrix * uTransform * vec4(aPos, 0, 1);
      vTexCoord = aTexCoord / uTexSize;
    }`
  ,
  fragment: frag
  ,
  uniforms: {
    uMatrix: { type: "mat4", value: new Float32Array(16) },
    uTransform: { type: "mat4", value: new Float32Array(16) },
    uTexture: { type: "tex", value: 0 },
    uTexSize: { type: "1i", value: 24 },
    iGlobalTime: { type: "f", value: 0 },
    animate: { type: "f", value: 0 },
    uColor: [1.0, 0.0, 0.0, 1.0],
    uOutlineColor: [1.0, 1.0, 1.0, 1.0],
    uDropShadowColor: [0.0, 0.0, 0.0, 1.0],
    uDropShadowSmoothing: { type: "1i", value: 0 },
    uDropShadowOffset: [0.0, 0.0],
    uOutlineDistance: { type: "1i", value: 0 },
    uGamma: { type: "1i", value: 0 },
    uDebug: { type: "1i", value: 1 },
    uDropShadow: { type: "1i", value: 1 },
    uOutline: { type: "1i", value: 1 }
  },
  attributes: {
    aPos: 0,
    aTexCoord: 0
  }
};

class CustomMSDFShader extends SC.Shader {
  constructor() {
    super(shaderContent.vertex, shaderContent.fragment, shaderContent.uniforms, shaderContent.attributes);
  }
}

module.exports = CustomMSDFShader;
