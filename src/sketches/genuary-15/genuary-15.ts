//@ts-nocheck
import * as THREE from 'three';
import * as dat from 'dat.gui';

import { SketchThreeObject, SketchThreeClass } from '../../types/sketchThree';
import { Artwork } from '../../types/artwork';

import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';

function artwork(this: SketchThreeClass): SketchThreeObject {
  let cube: THREE.Mesh;
  let lights;

  const gui = new dat.GUI();

  const vars = {
    skyColor: 0x3ebef6,
    bumpiness: 0.5,
    dunno: 0.5,
    noiseMultX: 12.8,
    noiseMultY: 2,
  };

  const sandMaterial = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      noiseMultX: { value: vars.noiseMultX },
      noiseMultY: { value: vars.noiseMultY },
    },
  });

  const setupRenderer = () => {
    this.renderer.setClearColor(vars.skyColor);
  };

  const setupGUI = () => {
    gui.addColor(vars, 'skyColor').onChange(() => {
      this.renderer.setClearColor(vars.skyColor);
      this.shouldRender = true;
    });

    gui.add(vars, 'noiseMultX', 0, 100).onChange(() => {
      sandMaterial.uniforms.noiseMultX.value = vars.noiseMultX;
      this.shouldRender = true;
    });

    gui.add(vars, 'noiseMultY', 0, 100).onChange(() => {
      sandMaterial.uniforms.noiseMultY.value = vars.noiseMultY;
      this.shouldRender = true;
    });
  };

  const setupCamera = (lookAtObject3D) => {
    this.camera.position.set(0, 10, 20);
    this.camera.lookAt(lookAtObject3D.position);
  };

  const dune = () => {
    const planeGeometry = new THREE.PlaneBufferGeometry(100, 100, 100, 100);
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
  };

  const onFrame = () => {};

  return {
    setup,
    onFrame,
    options: {
      showStats: true,
      useOrbit: true,
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
