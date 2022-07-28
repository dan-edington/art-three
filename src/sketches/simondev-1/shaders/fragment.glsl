varying vec2 vUv;
uniform sampler2D diffuse;
uniform sampler2D overlay;
uniform float repeatU;
uniform float repeatV;
uniform vec4 tint;

void main() {
  vec4 eric = texture2D(diffuse, vUv * vec2(repeatU, repeatV));
  vec4 duck = texture2D(overlay, vUv * vec2(repeatU, repeatV));
  vec4 color = mix(eric, duck, duck.w) * tint;
  gl_FragColor = vec4(color);
}