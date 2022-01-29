//@ts-nocheck
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass.js';

import { VignetteShader } from 'three/examples/jsm/shaders/VignetteShader';
import { FilmShader } from 'three/examples/jsm/shaders/FilmShader';
import { BleachBypassShader } from 'three/examples/jsm/shaders/BleachBypassShader';

import './noise.js';

import * as dat from 'dat.gui';

import {
  SketchThreeObject,
  SketchThreeClass,
  SketchThreeArtworkFunction,
} from '../../types/sketchThree';
import { Artwork } from '../../types/artwork';

import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';

const map = (value, min1, max1, min2, max2) => {
  return min2 + ((value - min1) * (max2 - min2)) / (max1 - min1);
};

function artwork(this: SketchThreeClass): SketchThreeObject {
  const gui = new dat.GUI();
  gui.close();
  let composer, vignettePass, filmPass, bleachPass, bokehPass;

  const seed = Math.round(new Date().getTime() * Math.random());
  noise.seed(seed);

  const getRandomHSLAsTHREEColor = (minH, maxH, minS, maxS, minL, maxL) => {
    const h = Math.floor(map(noise.perlin2(seed * 0.041, seed * 0.009), -1, 1, minH, maxH));
    const s = Math.floor(map(noise.perlin2(seed * 0.001, seed * 0.005), -1, 1, minS, maxS));
    const l = Math.floor(map(noise.perlin2(seed * 0.003, seed * 0.056), -1, 1, minL, maxL));

    return new THREE.Color(`hsl(${h}, ${s}%, ${l}%)`);
  };

  const vars = {
    skyColor: getRandomHSLAsTHREEColor(190, 210, 35, 100, 15, 80),
    sandColor: getRandomHSLAsTHREEColor(35, 55, 40, 100, 25, 75),
    textureNoiseMultX: map(noise.perlin2(seed * 0.06, seed * 0.031), -1, 1, 0, 20),
    textureNoiseMultY: map(noise.perlin2(seed * 0.091, seed * 0.008), -1, 1, 0, 100),
    geometryNoiseMultX: map(noise.perlin2(seed * 0.041, seed * 0.001), -1, 1, 10, 50),
    geometryNoiseMultY: map(noise.perlin2(seed * 0.002, seed * 0.006), -1, 1, 10, 100),
    bleachAmount: map(noise.perlin2(seed * 0.001, seed * 0.004), -1, 1, 1, 2),
    bokehFocus: 0.5,
    bokehMaxBlur: map(noise.perlin2(seed * 0.001, seed * 0.02), -1, 1, 0.001, 0.0125),
    bokehAperture: 0.5,
  };

  const sandMaterial = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      textureNoiseMultX: { value: vars.textureNoiseMultX },
      textureNoiseMultY: { value: vars.textureNoiseMultY },
      geometryNoiseMultX: { value: vars.geometryNoiseMultX },
      geometryNoiseMultY: { value: vars.geometryNoiseMultY },
      sandColor: { value: new THREE.Color(vars.sandColor) },
    },
  });

  const setupRenderer = () => {
    this.renderer.setClearColor(vars.skyColor);

    composer = new EffectComposer(this.renderer);

    const renderPass = new RenderPass(this.scene, this.camera);
    composer.addPass(renderPass);

    bokehPass = new BokehPass(this.scene, this.camera, {
      focus: vars.bokehFocus,
      maxblur: vars.bokehMaxBlur,
      aperture: vars.bokehAperture,
    });
    bokehPass.needsSwap = true;
    composer.addPass(bokehPass);

    bleachPass = new ShaderPass(BleachBypassShader);
    bleachPass.uniforms.opacity.value = vars.bleachAmount;
    composer.addPass(bleachPass);

    vignettePass = new ShaderPass(VignetteShader);
    composer.addPass(vignettePass);

    filmPass = new ShaderPass(FilmShader);
    filmPass.uniforms.grayscale.value = 0;
    filmPass.uniforms.nIntensity.value = 0.3;
    filmPass.uniforms.sIntensity.value = 0;
    composer.addPass(filmPass);
  };

  const setupGUI = () => {
    gui.addColor(vars, 'skyColor').onChange(() => {
      this.renderer.setClearColor(vars.skyColor);
    });

    gui.addColor(vars, 'sandColor').onChange(() => {
      sandMaterial.uniforms.sandColor.value.set(vars.sandColor);
    });

    gui.add(vars, 'textureNoiseMultX', 0, 20).onChange(() => {
      sandMaterial.uniforms.textureNoiseMultX.value = vars.textureNoiseMultX;
    });

    gui.add(vars, 'textureNoiseMultY', 0, 100).onChange(() => {
      sandMaterial.uniforms.textureNoiseMultY.value = vars.textureNoiseMultY;
    });

    gui.add(vars, 'geometryNoiseMultX', 0, 100).onChange(() => {
      sandMaterial.uniforms.geometryNoiseMultX.value = vars.geometryNoiseMultX;
    });

    gui.add(vars, 'geometryNoiseMultY', 0, 100).onChange(() => {
      sandMaterial.uniforms.geometryNoiseMultY.value = vars.geometryNoiseMultY;
    });

    gui.add(vars, 'bleachAmount', 1, 2).onChange(() => {
      bleachPass.uniforms.opacity.value = vars.bleachAmount;
    });

    gui.add(vars, 'bokehMaxBlur', 0, 0.1).onChange(() => {
      bokehPass.uniforms.maxblur.value = vars.bokehMaxBlur;
    });
  };

  const setupCamera = (lookAtObject3D) => {
    this.camera.position.set(0, 10, 20);
    this.camera.lookAt(lookAtObject3D.position);
  };

  const dune = () => {
    const planeGeometry = new THREE.PlaneBufferGeometry(200, 200, 100, 100);
    const planeMesh = new THREE.Mesh(planeGeometry, sandMaterial);
    planeMesh.rotation.x = -Math.PI / 2;
    return planeMesh;
  };

  const setup = () => {
    setupGUI();
    const duneMesh = dune();
    setupRenderer();
    setupCamera(duneMesh);
    this.scene.add(duneMesh);
    this.scene.fog = new THREE.Fog(0x666666, 100, 5000);
  };
  let a = true;
  const onFrame = () => {
    filmPass.uniforms.time.value = this.clock.getElapsedTime();
    if (a) {
      composer.render();
      a = false;
    }
  };

  return {
    setup,
    onFrame,
    options: {
      showStats: false,
      useOrbit: false,
      dimensions: {
        width: 800,
        height: 800,
      },
      disableAutoRender: true,
    },
  };
}

export default function (): Artwork<SketchThreeArtworkFunction> {
  return {
    type: 'THREEJS',
    artworkFunction: artwork,
  };
}
