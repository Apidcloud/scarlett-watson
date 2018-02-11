/**
 * MSDFTextShader Class
 */
module.exports = class CustomMSDFShader extends SC.Shader {
  static get shaderContent() {
    return {
      vertex: [
        "attribute vec2 aPos;",
        "attribute vec2 aTexCoord;",

        "uniform mat4 uMatrix;",
        "uniform mat4 uTransform;",
        "uniform vec2 uTexSize;",

        "varying vec2 vTexCoord;",

        "void main() {",
        "   gl_Position = uMatrix * uTransform * vec4(aPos, 0, 1);",
        "   vTexCoord = aTexCoord / uTexSize;",
        "}"
      ].join("\n"),
      fragment: [
        "#ifdef GL_OES_standard_derivatives",
        "#extension GL_OES_standard_derivatives : enable",
        "#endif",

        "precision highp float;",

        "uniform vec2 uTexSize;",
        "uniform sampler2D uTexture;",
        "uniform vec4 uColor;",
        "varying vec2 vTexCoord;",

        "float median(float r, float g, float b) {",
        " return max(min(r, g), min(max(r, g), b));",
        "}",

        "void main() {",
        " vec2 msdfUnit = 10.0/uTexSize;",
        " vec3 sample = texture2D(uTexture, vTexCoord).rgb;",
        " float sigDist = median(sample.r, sample.g, sample.b) - 0.5;",
        " sigDist *= dot(msdfUnit, 0.5/fwidth(vTexCoord));",
        " float alpha = clamp(sigDist + 0.5, 0.0, 1.0);",
        " gl_FragColor = mix(vec4(141.0/255.0, 170.0/255.0, 186.0/255.0, 0.0), uColor, alpha);",
        "}"
      ].join("\n"),
      uniforms: {
        uMatrix: { type: "mat4", value: new Float32Array(16) },
        uTransform: { type: "mat4", value: new Float32Array(16) },
        uTexture: { type: "tex", value: 0 },
        uTexSize: { type: "1i", value: 24 },
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
  }

  constructor() {
    let content = CustomMSDFShader.shaderContent;

    super(content.vertex, content.fragment, content.uniforms, content.attributes);
  }
}
