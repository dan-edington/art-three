import * as THREE from 'three';

import {
  SketchThreeObject,
  SketchThreeClass,
  SketchThreeArtworkFunction,
} from '../../types/sketchThree';
import { Artwork } from '../../types/artwork';

import vertexShader from './shaders/vertex.vert';
import fragmentShader from './shaders/fragment.frag';

function artwork(this: SketchThreeClass): SketchThreeObject {
  let vinyl: THREE.Mesh;

  const createVinylMesh = () => {
    const geometry = new THREE.CylinderBufferGeometry(12, 12, 0.08, 128, 1);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uResolution: {
          value: new THREE.Vector2(window.innerWidth, window.innerHeight),
        },
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
    vinyl = createVinylMesh();
    this.scene.add(vinyl);
    this.camera.position.set(25, 25, 25);
    this.camera.lookAt(vinyl.position);
  };

  const onFrame = () => {
    // this.shouldRender = true;
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
