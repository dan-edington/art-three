varying vec2 vUv;

uniform float uTime;
uniform vec2 uResolution;

vec3 black = vec3(0.0, 0.0, 0.0);
vec3 white = vec3(1.0, 1.0, 1.0);
vec3 red = vec3(1.0, 0.0, 0.0);

float stroke(float x, float s, float w) {
  float d = step(s, x + w * 0.5) - step(s, x - w * 0.5);
  return clamp(d, 0.0, 1.0);
}

float animatedLine(float size, float offset) {
  vec2 st = (vUv - 0.5) * uResolution;
  float branch = .5 + (st.x-st.y) * 0.5;
  float pos = sin(uTime) * 150.0;
  float line = stroke(branch, pos + offset, size);
  return line;
}

void main() {
  vec3 color = white;



  // vec2 st = gl_FragCoord.xy / uResolution;


  color = mix(red, black, animatedLine(50., 50.0));
  color = mix(red, black, animatedLine(25., -300.0));
  color = mix(red, black, animatedLine(50., 150.0));
  color = mix(red, black, animatedLine(25., 400.0));

  gl_FragColor = vec4(color, 1.0);
}
