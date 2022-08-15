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

mat3 rotateX(float angle) {
  float c = cos(angle);
  float s = sin(angle);

  return mat3(
    1., 0., 0.,
    0., c, -s,
    0., s, c
  );
}

mat3 rotateY(float angle) {
  float c = cos(angle);
  float s = sin(angle);

  return mat3(
    c, 0., s,
    0., 1., 0.,
    -s, 0., c
  );
}

mat3 rotateZ(float angle) {
  float c = cos(angle);
  float s = sin(angle);

  return mat3(
    c, -s, 0.,
    s, c, 0.,
    0., 0., 1.
  );
}

void main() {
  vec3 localSpacePosition = position;

  // translate
  localSpacePosition.x += sin(time) * 2.0;

  // scale
  localSpacePosition *= remap(sin(time), -1.0, 1.0, 0.5, 2.0);

  // rotate
  localSpacePosition *= rotateX(remap(sin(time), -1.0, 1.0, 0.0, PI * 2.));

  vec4 modelViewPosition = modelViewMatrix * vec4(localSpacePosition, 1.0);
  gl_Position = projectionMatrix * modelViewPosition;

  vNormal = (modelMatrix * vec4(normal, 0.0)).xyz;
  vPosition = (modelMatrix * vec4(localSpacePosition, 1.0)).xyz;
  vUv = uv;
}