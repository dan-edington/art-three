varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vColor;

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
  vec3 peakColor = vec3(0.99, 0.66, 0.08);
  vec3 troughColor = vec3(0.44, 0.04, 0.48);

  float t = remap(sin(localSpacePosition.y * 10.0 + time), -1.0, 1.0, 0.0, 0.2);
  localSpacePosition += normal * t;

  vec4 modelViewPosition = modelViewMatrix * vec4(localSpacePosition, 1.0);
  gl_Position = projectionMatrix * modelViewPosition;

  vNormal = (modelMatrix * vec4(normal, 0.0)).xyz;
  vPosition = (modelMatrix * vec4(localSpacePosition, 1.0)).xyz;
  vUv = uv;
  vColor = mix(peakColor, troughColor, smoothstep(0.0, 0.25, t));
}