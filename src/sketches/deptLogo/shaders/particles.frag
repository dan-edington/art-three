uniform float uProgress;
varying vec2 vUv;
varying float parabola;

float PI = 3.14159265;

void main() {
  if(uProgress >= 1.) discard;

  float strength = distance(gl_PointCoord, vec2(0.5));
  strength *= 2.0;
  strength = 1.0 - strength;
  strength *= parabola;

  gl_FragColor = vec4(vec3(1.0), strength);
}
