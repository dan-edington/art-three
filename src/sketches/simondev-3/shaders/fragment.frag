precision mediump float;

varying vec2 vUv;

vec3 red = vec3(1.0, 0.0, 0.0);
vec3 green = vec3(0.0, 1.0, 0.0);
vec3 blue = vec3(0.0, 0.0, 1.0);
vec3 white = vec3(1.0);
vec3 black = vec3(0.0);
vec3 yellow = vec3(1.0, 1.0, 0.0);
vec3 grey = vec3(0.75);

void main() {
  vec3 color = grey;

  float xAxis = step(0.005, abs(vUv.y - 0.5));
  float yAxis = step(0.005, abs(vUv.x - 0.5));

  vec2 cell = fract(vUv * 10.0);
  cell = abs(cell - 0.5);
  float distToCell = 1.0 - max(cell.x, cell.y) * 2.0;
  float cellLine = smoothstep(0.0, 0.05, distToCell);

  float value1 = vUv.x;
  float value2 = mod(vUv.x, 1.8);
  float line1 = step(0.003, abs(vUv.y - value1));
  float line2 = step(0.003, abs(vUv.y - value2));

  color = mix(black, grey, cellLine);
  color = mix(blue, color, xAxis);
  color = mix(blue, color, yAxis);
  color = mix(yellow, color, line1);
  color = mix(red, color, line2);

  gl_FragColor = vec4(color, 1.);
}