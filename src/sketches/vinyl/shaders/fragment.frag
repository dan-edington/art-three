precision mediump float;

varying vec2 vUv;

const float PI = 3.1415926;
const float TAU = 6.2831853;

float inverseLerp(float v, float minValue, float maxValue) {
  return (v - minValue) / (maxValue - minValue);
}

float remap(float v, float inMin, float inMax, float outMin, float outMax) {
  float t = inverseLerp(v, inMin, inMax);
  return mix(outMin, outMax, t);
}

float drawCircle(vec2 uv, vec2 center, float radius) {
  float d = distance(uv, center);
  return smoothstep(radius, radius - 0.01, d);
}

void main() {
  vec3 color = vec3(drawCircle(vUv, vec2(0.5), 0.15));
  color = color * vec3(drawCircle(vUv, vec2(0.5), 0.05));
  gl_FragColor = vec4(color, 1.);
}