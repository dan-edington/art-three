import * as THREE from 'three';
import * as dat from 'dat.gui';

import {
  SketchThreeObject,
  SketchThreeClass,
  SketchThreeArtworkFunction,
} from '../../types/sketchThree';
import { Artwork } from '../../types/artwork';

import vertexShader from './shaders/vertex.vert';
import fragmentShader from './shaders/fragment.frag';

function artwork(this: SketchThreeClass): SketchThreeObject {
  let cube: THREE.Mesh;
  let lights;

  const gui = new dat.GUI();

  const vars = {};

  const createCube = () => {
    const geometry = new THREE.PlaneBufferGeometry();
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        resolution: { value: new THREE.Vector2(window.innerWidth, window.innerWidth) },
      },
      vertexShader,
      fragmentShader,
    });
    return new THREE.Mesh(geometry, material);
  };

  const createLights = () => {
    const lights = {
      ambient: new THREE.AmbientLight(0xffffff, 0.25),
      point: new THREE.PointLight(0xffffff, 1.0),
    };

    lights.point.position.set(2, 2, 2);

    this.scene.add(...Object.values(lights));
  };

  const setup = () => {
    createLights();
    cube = createCube();
    this.scene.add(cube);
    this.camera.position.z = 0.75;
  };

  const onFrame = () => {
    this.shouldRender = true;
    //@ts-ignore
    cube.material.uniforms.time.value = this.clock.getElapsedTime();
  };

  // window.addEventListener('resize', () => {
  //   //@ts-ignore
  //   cube.material.uniforms.resolution.value = new THREE.Vector2(
  //     window.innerWidth,
  //     window.innerHeight,
  //   );
  // });

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
