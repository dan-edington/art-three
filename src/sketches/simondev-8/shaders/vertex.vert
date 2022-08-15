varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

uniform float time;

const float PI = 3.1415926;

float inverseLerp(float v, float minValue, float maxValue) {
  return (v - minValue) / (maxValue - minValue);
}

float remap(float v, float inMin, float inMax, float outMin, float outMax) {
  float t = inverseLerp(v, inMin, inMax);
  return mix(outMin, outMax, t);
}

float easeOutBounce(float x) {
  float n1 = 7.5625;
  float d1 = 2.75;

  if (x < 1.0 / d1) {
    return n1 * x * x;
  } else if (x < 2.0 / d1) {
    return n1 * (x -= 1.5 / d1) * x + 0.75;
  } else if (x < 2.5 / d1) {
    return n1 * (x -= 2.25 / d1) * x + 0.9375;
  } else {
    return n1 * (x -= 2.625 / d1) * x + 0.984375;
  }
}

float easeInOutBounce(float x) {
  return x < 0.5
    ? (1.0 - easeOutBounce(1.0 - 2.0 * x)) / 2.0
    : (1.0 + easeOutBounce(2.0 * x - 1.0)) / 2.0;
}

void main() {
  vec3 localSpacePosition = position;

  localSpacePosition *= easeInOutBounce(clamp(time - 2.0, 0.0, 1.0));

  vec4 modelViewPosition = modelViewMatrix * vec4(localSpacePosition, 1.0);
  gl_Position = projectionMatrix * modelViewPosition;

  vNormal = (modelMatrix * vec4(normal, 0.0)).xyz;
  vPosition = (modelMatrix * vec4(localSpacePosition, 1.0)).xyz;
  vUv = uv;
}