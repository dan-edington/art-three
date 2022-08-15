precision mediump float;

uniform float time;
uniform float speed;
uniform float size;
uniform float transparency;
varying vec2 vUv;
uniform sampler2D diffuse;

float inverseLerp(float v, float minValue, float maxValue) {
  return (v - minValue) / (maxValue - minValue);
}

float remap(float v, float inMin, float inMax, float outMin, float outMax) {
  float t = inverseLerp(v, inMin, inMax);
  return mix(outMin, outMax, t);
}


void main() {
  vec3 eric = texture2D(diffuse, vUv).rgb;
  float yOffset = time * 0.5 * speed;
  float t = sin(((vUv.y + yOffset) * size));
  vec3 color = mix(vec3(0.0), vec3(1.0), t);

  color = mix(color, eric, transparency);

  gl_FragColor = vec4(color, 1.0);
}