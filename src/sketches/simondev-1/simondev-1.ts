import * as THREE from 'three';
import * as dat from 'dat.gui';

import {
  SketchThreeObject,
  SketchThreeClass,
  SketchThreeArtworkFunction,
} from '../../types/sketchThree';
import { Artwork } from '../../types/artwork';

import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';

function artwork(this: SketchThreeClass): SketchThreeObject {
  let cube: THREE.Mesh;
  let lights;

  const gui = new dat.GUI();

  const vars = {
    tint: new THREE.Color(0xff0000),
  };

  const loader = new THREE.TextureLoader();
  const texture = loader.load('/simondev/ericcantona.jpg');
  const overlay = loader.load('/simondev/duck.png');

  const createCube = function () {
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.ShaderMaterial({
      uniforms: {
        tint: { value: new THREE.Vector4(vars.tint.r, vars.tint.g, vars.tint.b, 1) },
        diffuse: { value: texture },
        overlay: { value: overlay },
        time: { value: 0 },
        resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      },
      vertexShader,
      fragmentShader,
    });
    return new THREE.Mesh(geometry, material);
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
    cube = createCube();
    this.scene.add(cube, ...Object.values(lights));

    gui.addColor(vars, 'tint').onChange(() => {
      //@ts-ignore
      cube.material.uniforms.tint.value = new THREE.Vector4(
        vars.tint.r / 255,
        vars.tint.g / 255,
        vars.tint.b / 255,
        1,
      );
    });
  };

  const onFrame = () => {
    this.shouldRender = true;
  };

  return {
    setup,
    onFrame,
    options: {
      showStats: true,
      useOrbit: true,
    },
  };
}

export default function (): Artwork<SketchThreeArtworkFunction> {
  return {
    type: 'THREEJS',
    artworkFunction: artwork,
  };
}
