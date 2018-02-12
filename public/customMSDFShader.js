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

        "vec3 mod289(vec3 x) {",
        "  return x - floor(x * (1.0 / 289.0)) * 289.0;",
        "}",

        "vec4 mod289(vec4 x) {",
        "  return x - floor(x * (1.0 / 289.0)) * 289.0;",
        "}",

        "vec4 permute(vec4 x) {",
        "    return mod289(((x*34.0)+1.0)*x);",
        "}",

        "vec4 taylorInvSqrt(vec4 r)",
        "{",
        "  return 1.79284291400159 - 0.85373472095314 * r;",
        "}",

        "float snoise(vec3 v)",
        "  {",
        "  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;",
        "  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);",

        "  vec3 i  = floor(v + dot(v, C.yyy) );",
        "  vec3 x0 =   v - i + dot(i, C.xxx) ;",

        "  vec3 g = step(x0.yzx, x0.xyz);",
        "  vec3 l = 1.0 - g;",
        "  vec3 i1 = min( g.xyz, l.zxy );",
        "  vec3 i2 = max( g.xyz, l.zxy );",

        "  vec3 x1 = x0 - i1 + C.xxx;",
        "  vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y",
        "  vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y",

        "  i = mod289(i);",
        "  vec4 p = permute( permute( permute(",
        "            i.z + vec4(0.0, i1.z, i2.z, 1.0 ))",
        "          + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))",
        "          + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));",

        "  float n_ = 0.142857142857; // 1.0/7.0",
        "  vec3  ns = n_ * D.wyz - D.xzx;",

        "  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);",

        "  vec4 x_ = floor(j * ns.z);",
        "  vec4 y_ = floor(j - 7.0 * x_ );",

        "  vec4 x = x_ *ns.x + ns.yyyy;",
        "  vec4 y = y_ *ns.x + ns.yyyy;",
        "  vec4 h = 1.0 - abs(x) - abs(y);",
        "  vec4 b0 = vec4( x.xy, y.xy );",
        "  vec4 b1 = vec4( x.zw, y.zw );",

        "  vec4 s0 = floor(b0)*2.0 + 1.0;",
        "  vec4 s1 = floor(b1)*2.0 + 1.0;",
        "  vec4 sh = -step(h, vec4(0.0));",

        "  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;",
        "  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;",

        "  vec3 p0 = vec3(a0.xy,h.x);",
        "  vec3 p1 = vec3(a0.zw,h.y);",
        "  vec3 p2 = vec3(a1.xy,h.z);",
        "  vec3 p3 = vec3(a1.zw,h.w);",

        "  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));",
        "  p0 *= norm.x;",
        "  p1 *= norm.y;",
        "  p2 *= norm.z;",
        "  p3 *= norm.w;",

        "  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);",
        "  m = m * m;",
        "  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),",
        "                                dot(p2,x2), dot(p3,x3) ) );",
        "  }",

        "float aastep(float threshold, float value) {",
        "  #ifdef GL_OES_standard_derivatives",
        "    float afwidth = length(vec2(dFdx(value), dFdy(value))) * 0.70710678118654757;",
        "    return smoothstep(threshold-afwidth, threshold+afwidth, value);",
        "  #else",
        "    return step(threshold, value);",
        "  #endif ",
        "}",

        "uniform vec2 uTexSize;",
        "uniform sampler2D uTexture;",
        "uniform vec4 uColor;",
        "uniform float uGamma;",
        "uniform float uOutlineDistance;",
        "uniform vec4 uOutlineColor;",
        "uniform float iGlobalTime;",
        "uniform float animate;",

        "uniform vec4 uDropShadowColor;",
        "uniform float uDropShadowSmoothing;",
        "uniform vec2 uDropShadowOffset;",

        "uniform float uDebug;",
        "uniform float uDropShadow;",
        "uniform float uOutline;",

        "varying vec2 vTexCoord;",

        "float median(float r, float g, float b) {",
        " return max(min(r, g), min(max(r, g), b));",
        "}",

        "void main() {",
        " float alpha = 0.0;",

        " float animValue = pow(abs(animate * 2.0 - 1.0), 12.0 - 0.5 * 5.0);",
        " float threshold = animValue * 0.5 + 0.5;", // first value fades the entire thing. 1.0 is completely faded.
        " vec2 msdfUnit = 10.0/uTexSize;",
        " vec3 sample = texture2D(uTexture, vTexCoord).rgb;",
        " float med = median(sample.r, sample.g, sample.b);",
        " float sigDist = med - 0.5;",
        " sigDist *= dot(msdfUnit, 0.5/fwidth(vTexCoord));",

        " alpha += 0.15 * aastep(threshold, med + 0.4 * snoise(vec3(vTexCoord * 10.0, iGlobalTime)));",
        " alpha += 0.35 * aastep(threshold, med + 0.1 * snoise(vec3(vTexCoord * 20.0, iGlobalTime)));",
        " alpha += 0.15 * aastep(threshold, med);",

        " gl_FragColor = vec4(uColor.rgb, alpha);",
        "}"
      ].join("\n"),
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
  }

  constructor() {
    let content = CustomMSDFShader.shaderContent;

    super(content.vertex, content.fragment, content.uniforms, content.attributes);
  }
}
  
