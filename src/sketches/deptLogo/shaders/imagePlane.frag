varying vec2 vUv;
uniform sampler2D uTexture;
uniform float uProgress;

void main() {
  vec4 color = texture2D(uTexture, vUv.xy);
  vec3 gradient = vec3((1.0 + vUv.x) - (uProgress * 2.5));
  color.rgb *= gradient;

  if(color.a < 0.1) {
    discard;
  }

  gl_FragColor = color;
}