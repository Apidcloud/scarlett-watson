#ifdef GL_OES_standard_derivatives
  #extension GL_OES_standard_derivatives : enable
#endif

precision highp float;

#pragma glslify: noise = require('glsl-noise/simplex/3d')
#pragma glslify: aastep = require('glsl-aastep')

uniform vec2 uTexSize;
uniform sampler2D uTexture;
uniform vec4 uColor;
uniform float uGamma;
uniform float uOutlineDistance;
uniform vec4 uOutlineColor;
uniform float iGlobalTime;
uniform float animate;

uniform vec4 uDropShadowColor;
uniform float uDropShadowSmoothing;
uniform vec2 uDropShadowOffset;

uniform float uDebug;
uniform float uDropShadow;
uniform float uOutline;

varying vec2 vTexCoord;

float median(float r, float g, float b) {
  return max(min(r, g), min(max(r, g), b));
}

void main() {
  float alpha = 0.0;

  float animValue = pow(abs(animate * 2.0 - 1.0), 12.0 - 0.5 * 5.0);
  float threshold = animValue * 0.5 + 0.5;
  vec2 msdfUnit = 10.0/uTexSize;
  vec3 sample = texture2D(uTexture, vTexCoord).rgb;
  float med = median(sample.r, sample.g, sample.b);
  float sigDist = med - 0.5;
  sigDist *= dot(msdfUnit, 0.5/fwidth(vTexCoord));

  alpha += 0.15 * aastep(threshold, med + 0.4 * noise(vec3(vTexCoord * 10.0, iGlobalTime)));
  alpha += 0.35 * aastep(threshold, med + 0.1 * noise(vec3(vTexCoord * 20.0, iGlobalTime)));
  alpha += 0.15 * aastep(threshold, med);

  gl_FragColor = vec4(uColor.rgb, alpha);
}
