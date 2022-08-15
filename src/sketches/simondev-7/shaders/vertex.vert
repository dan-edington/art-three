varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec4 vColor;

uniform float time;

const float PI = 3.1415926;

float inverseLerp(float v, float minValue, float maxValue) {
  return (v - minValue) / (maxValue - minValue);
}

float remap(float v, float inMin, float inMax, float outMin, float outMax) {
  float t = inverseLerp(v, inMin, inMax);
  return mix(outMin, outMax, t);
}

void main() {
  vec3 localSpacePosition = position;

  vec4 modelViewPosition = modelViewMatrix * vec4(localSpacePosition, 1.0);
  gl_Position = projectionMatrix * modelViewPosition;

  vNormal = (modelMatrix * vec4(normal, 0.0)).xyz;
  vPosition = (modelMatrix * vec4(localSpacePosition, 1.0)).xyz;
  vUv = uv;

  vec3 color1 = vec3(1.0, 1.0, 0.0);
  vec3 color2 = vec3(0.0, 1.0, 0.5);
  float t = remap(localSpacePosition.x, -0.5, 0.5, 0.0, 1.0);
  t = pow(t, 2.0);

  vColor = vec4(mix(color1, color2, t), t);
}