varying vec2 vUv;

float frequency = 2.0;

void main() {
  
  float stripes = frequency * vUv.x;
  float rounded = floor(stripes);
  float count = 7.0;

  vec4 r = vec4(255.0 / 255.0, 0.0 / 255.0, 0.0 / 255.0, 1.0);
  vec4 o = vec4(255.0 / 255.0, 127.0 / 255.0, 0.0 / 255.0, 1.0);
  vec4 y = vec4(254.0 / 255.0, 255.0 / 255.0, 0.0 / 255.0, 1.0);
  vec4 g = vec4(0.0 / 255.0, 188.0 / 255.0, 63.0 / 255.0, 1.0);
  vec4 b = vec4(0.0 / 255.0, 104.0 / 255.0, 255.0 / 255.0, 1.0);
  vec4 i = vec4(122.0 / 255.0, 0.0 / 255.0, 229.0 / 255.0, 1.0);
  vec4 v = vec4(211.0 / 255.0, 0.0 / 255.0, 200.0 / 255.0, 1.0);
  
  if (mod(rounded, count) == 0.0) {
    gl_FragColor = r;   
  } else if (mod(rounded, count) == 2.0) {
    gl_FragColor = o;   
  } else if (mod(rounded, count) == 3.0) {
    gl_FragColor = y;   
  } else if (mod(rounded, count) == 4.0) {
    gl_FragColor = g;   
  } else if (mod(rounded, count) == 5.0) {
    gl_FragColor = b;   
  } else if (mod(rounded, count) == 6.0) {
    gl_FragColor = i;   
  } else {
    gl_FragColor = v;   
  }
}