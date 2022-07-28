varying vec2 vUv;

uniform sampler2D diffuse;

uniform float contrast;

void main() {
  vec3 color = vec3(0.0);
  vec3 white = vec3(1.0);
  vec3 red = vec3(1.0, 0.0, 0.0);
  vec3 blue = vec3(0.0, 0.0, 1.0);

  float value1 = vUv.x;
  float value2 = smoothstep(0.0, 1.0, vUv.x);
  float value3 = step(vUv.x, 0.5);

  float linearLine = smoothstep(0.0, 0.005, abs(vUv.y - mix(0.666, 1.0, value1)));
  float smoothLine = smoothstep(0.0, 0.005, abs(vUv.y - mix(0.0, 0.333, value2)));
  float stepLine = smoothstep(0.0, 0.005, abs(vUv.y - mix(0.333, 0.666, value3)));

  if(vUv.y > 0.666) {
    color = mix(red, blue, vUv.x);
  } else if(vUv.y > 0.333) {
    color = mix(red, blue, step(vUv.x, 0.5));
  } else {
    color = mix(red, blue, smoothstep(0.0, 1.0, vUv.x));
  }

  // color = mix(white, color, linearLine);
  // color = mix(white, color, smoothLine);
  // color = mix(white, color, stepLine);
    
  color = texture2D(diffuse, vUv).rgb;
  // float r = step(contrast, color.r);
  // float g = step(contrast, color.g);
  // float b = step(contrast, color.b);

  float r = smoothstep(contrast,1.0, color.r);
  float g = smoothstep(contrast,1.0, color.g);
  float b = smoothstep(contrast,1.0, color.b);
  color = vec3(r,g,b);

  gl_FragColor = vec4(color, 1.0);
}