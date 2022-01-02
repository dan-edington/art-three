//@ts-nocheck
import * as THREE from 'three';

import { SketchThreeObject, SketchThreeClass } from '../../types/sketchThree';
import { Artwork } from '../../types/artwork';

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';

const vertShader = `
varying vec2 vUv;

void main() {
	vUv = uv;
	gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

const fragShader = `

  uniform vec2 randoms;
  uniform sampler2D tDiffuse;
  varying vec2 vUv;

  float hue2rgb(float f1, float f2, float hue) {
    if (hue < 0.0)
        hue += 1.0;
    else if (hue > 1.0)
        hue -= 1.0;
    float res;
    if ((6.0 * hue) < 1.0)
        res = f1 + (f2 - f1) * 6.0 * hue;
    else if ((2.0 * hue) < 1.0)
        res = f2;
    else if ((3.0 * hue) < 2.0)
        res = f1 + (f2 - f1) * ((2.0 / 3.0) - hue) * 6.0;
    else
        res = f1;
    return res;
  }

  vec3 hsl2rgb(vec3 hsl) {
      vec3 rgb;
      
      if (hsl.y == 0.0) {
          rgb = vec3(hsl.z); // Luminance
      } else {
          float f2;
          
          if (hsl.z < 0.5)
              f2 = hsl.z * (1.0 + hsl.y);
          else
              f2 = hsl.z + hsl.y - hsl.y * hsl.z;
              
          float f1 = 2.0 * hsl.z - f2;
          
          rgb.r = hue2rgb(f1, f2, hsl.x + (1.0/3.0));
          rgb.g = hue2rgb(f1, f2, hsl.x);
          rgb.b = hue2rgb(f1, f2, hsl.x - (1.0/3.0));
      }   
      return rgb;
  }

  float rand(vec2 co){
    return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
  }

  void main() {
    // Dithering shader from
    // https://github.com/chadxhillary/1bit-shader/blob/master/1-Bit%20Demo/customShaders.js

    vec4 color = texture2D( tDiffuse, vUv );
    vec4 fragPos = gl_FragCoord;

    // Converting to less colors (grayscale) using Gamma formula
    float grey = 0.2126 * color.r + 0.7152 * color.g + 0.0722 * color.b;
    grey = grey / 0.039;
    grey = floor(grey + 0.5);
    grey = grey * 0.039;


    // get dithering threshold
    float ttt = 8.0;
    int x = int(mod(fragPos.x, ttt));
    int y = int(mod(fragPos.y, ttt));

    // glsl doesen't let me use a matrix so we're gonna have to hard code
    int index = (x * 32) + y; // index of pseudomatrix
    float dither;

    if (index <= 0) dither = 0.0;
    if (index == 1) dither = 48.0;
    if (index == 2) dither = 12.0;
    if (index == 3) dither = 60.0;
    if (index == 4) dither = 3.0;
    if (index == 5) dither = 51.0;
    if (index == 6) dither = 15.0;
    if (index == 7) dither = 61.0;
    if (index == 8) dither = 32.0;
    if (index == 9) dither = 16.0;
    if (index == 10) dither = 44.0;
    if (index == 11) dither = 28.0;
    if (index == 12) dither = 35.0;
    if (index == 13) dither = 19.0;
    if (index == 14) dither = 47.0;
    if (index == 15) dither = 31.0;
    if (index == 16) dither = 8.0;
    if (index == 17) dither = 56.0;
    if (index == 18) dither = 4.0;
    if (index == 19) dither = 52.0;
    if (index == 20) dither = 11.0;
    if (index == 21) dither = 59.0;
    if (index == 22) dither = 7.0;
    if (index == 23) dither = 55.0;
    if (index == 24) dither = 40.0;
    if (index == 25) dither = 24.0;
    if (index == 26) dither = 36.0;
    if (index == 27) dither = 20.0;
    if (index == 28) dither = 43.0;
    if (index == 29) dither = 27.0;
    if (index == 30) dither = 39.0;
    if (index == 31) dither = 23.0;
    if (index == 32) dither = 2.0;
    if (index == 33) dither = 50.0;
    if (index == 34) dither = 14.0;
    if (index == 35) dither = 62.0;
    if (index == 36) dither = 1.0;
    if (index == 37) dither = 49.0;
    if (index == 38) dither = 13.0;
    if (index == 39) dither = 61.0;
    if (index == 40) dither = 34.0;
    if (index == 41) dither = 18.0;
    if (index == 42) dither = 46.0;
    if (index == 43) dither = 30.0;
    if (index == 44) dither = 33.0;
    if (index == 45) dither = 17.0;
    if (index == 46) dither = 45.0;
    if (index == 47) dither = 29.0;
    if (index == 48) dither = 10.0;
    if (index == 49) dither = 58.0;
    if (index == 50) dither = 6.0;
    if (index == 51) dither = 54.0;
    if (index == 52) dither = 9.0;
    if (index == 53) dither = 57.0;
    if (index == 54) dither = 5.0;
    if (index == 55) dither = 53.0;
    if (index == 56) dither = 42.0;
    if (index == 57) dither = 26.0;
    if (index == 58) dither = 38.0;
    if (index == 59) dither = 22.0;
    if (index == 60) dither = 41.0;
    if (index == 61) dither = 25.0;
    if (index == 62) dither = 37.0;
    if (index >= 63) dither = 21.0;

    dither *= (1.0 / 128.0); // matrix math

    vec3 bgColor = vec3(rand(randoms));
    vec3 ditherColor = hsl2rgb(vec3(rand(randoms), 1.0, 0.5));

    // The Threshold
    if(grey > dither)
      gl_FragColor = vec4(vec3(bgColor), 1.0); // BG
    else
      gl_FragColor = vec4(ditherColor,1.0); // Dither
    }

`;

function artwork(this: SketchThreeClass): SketchThreeObject {
  let lights;
  let composer: EffectComposer;

  const createCubes = function () {
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshStandardMaterial({ color: 'hotpink' });
    const cubes = [];
    for (let i = 0; i <= 10; i++) {
      const c = new THREE.Mesh(geometry, material);
      c.scale.set(Math.random() * 5, Math.random() * 5, Math.random() * 5);
      c.position.set(Math.random() * 10 - 5, Math.random() * 10 - 5, Math.random() * 10 - 5);
      c.rotation.set(
        Math.random() * 2 * Math.PI,
        Math.random() * 2 * Math.PI,
        Math.random() * 2 * Math.PI,
      );
      cubes.push(c);
    }
    return cubes;
  };

  const createLights = function () {
    return {
      ambient: new THREE.AmbientLight(0xffffff, 0.25),
      point: new THREE.PointLight(0xffffff, 1.0),
    };
  };

  const setup = () => {
    lights = createLights();
    lights.point.position.set(2, 2, 2);
    const cubes = createCubes();
    this.scene.add(...cubes, ...Object.values(lights));

    composer = new EffectComposer(this.renderer);
    const renderPass = new RenderPass(this.scene, this.camera);

    const ditherShader = new THREE.ShaderMaterial({
      uniforms: {
        resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        tDiffuse: { value: null },
        randoms: { value: new THREE.Vector2(Math.random(), Math.random()) },
      },
      vertexShader: vertShader,
      fragmentShader: fragShader,
    });

    const shaderPass = new ShaderPass(ditherShader);

    composer.addPass(renderPass);
    composer.addPass(shaderPass);

    this.camera.position.set(Math.random() * 10, Math.random() * 10, 10);
    this.camera.lookAt(0, 0, 0);
  };

  const onFrame = () => {
    composer.render();
  };

  return {
    setup,
    onFrame,
    options: {
      showStats: false,
      useOrbit: false,
      noAnimation: true,
      disableAutoRender: true,
      dimensions: {
        width: 800,
        height: 800,
      },
    },
  };
}

export default function (): Artwork<SketchThreeObject> {
  return {
    type: 'THREEJS',
    artworkFunction: artwork,
  };
}
