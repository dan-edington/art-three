precision mediump float;

varying vec2 vUv;

const float PI = 3.1415926;

float inverseLerp(float v, float minValue, float maxValue) {
  return (v - minValue) / (maxValue - minValue);
}

float remap(float v, float inMin, float inMax, float outMin, float outMax) {
  float t = inverseLerp(v, inMin, inMax);
  return mix(outMin, outMax, t);
}

void main() {
  vec3 color = vec3(0.776,0.282,0.184);
  gl_FragColor = vec4(color, 1.);
}