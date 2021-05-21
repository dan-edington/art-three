varying vec3 pos;
varying vec2 vUv;

void main() {
  float light = dot(pos, vec3(5., 7., -10.)) * -0.05;
  vec3 color = vec3(0.5 * light, 1. * light, 1. * light);
  gl_FragColor = vec4(color, 1.);
}