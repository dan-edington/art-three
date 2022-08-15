precision mediump float;

uniform float time;
uniform vec2 resolution;
varying vec2 vUv;

const float PI = 3.1415926;

vec3 black = vec3(0.0);
vec3 grey = vec3(0.5);
vec3 white = vec3(1.0);
vec3 red = vec3(1.0, 0.0, 0.0);
vec3 green = vec3(0.0, 1.0, 0.0);
vec3 blue = vec3(0.0, 0.0, 1.0);

float inverseLerp(float v, float minValue, float maxValue) {
  return (v - minValue) / (maxValue - minValue);
}

float remap(float v, float inMin, float inMax, float outMin, float outMax) {
  float t = inverseLerp(v, inMin, inMax);
  return mix(outMin, outMax, t);
}

vec3 bgColor() {
  float distFromCenter = length(abs(vUv - 0.5));
  float vignette = 1.0 - distFromCenter;
  vignette = smoothstep(0.0, 0.7, vignette);
  vignette = remap(vignette, 0.0, 1.0, 0.3, 1.0);
  return vec3(vignette);
}

vec3 drawGrid(vec3 color, vec3 lineColor, float cellSpacing, float lineWidth) {
  vec2 center = vUv - 0.5;
  vec2 cells = abs(fract(center * resolution / vec2(cellSpacing)) - 0.5);
  float distToEdge = (0.5 - max(cells.x, cells.y)) * cellSpacing;
  float lines = smoothstep(0.0, lineWidth, distToEdge);
  color = mix(lineColor, color, lines);
  return color;
}

float sdfCircle(vec2 p, float r) {
   return length(p) - r;
}

float sdfLine(vec2 p, vec2 a, vec2 b) {
  vec2 pa = p - a;
  vec2 ba = b - a;
  float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  return length(pa - ba * h);
}

float sdfBox(vec2 p, vec2 size) {
  vec2 q = abs(p) - size;
  return length(max(q, vec2(0.0))) + min(max(q.x, q.y), 0.0);
}

mat2 rotate2d(float angle) {
  float c = cos(angle);
  float s = sin(angle);
  return mat2(c, -s, s, c);
}

void main() {
  vec2 pixelCoords = (vUv - 0.5) * resolution;
  vec3 baseColor = vec3(0.81);

  vec3 color = bgColor();
  color = drawGrid(color, grey, 10.0, 1.0);
  color = drawGrid(color, black, 100.0, 2.0);

  float d = sdfCircle(pixelCoords, 400.0);
  color = mix(blue, color, smoothstep(-1.0, 1.0, d));
  color = mix(red, color, smoothstep(-5.0, 0.0, d));

  // float d = sdfLine(pixelCoords, vec2(-100.0, -50.0), vec2(200.0, -75.0));
  // color = mix(red, color, step(2.0, d));

  // vec2 boxPos = pixelCoords - vec2(300.0, -100.0);
  // boxPos *= rotate2d(time);
  // float d = sdfBox(boxPos, vec2(100.0, 50.0));
  // color = mix(red, color, step(0.0, d));


  gl_FragColor = vec4(color, 1.);
}