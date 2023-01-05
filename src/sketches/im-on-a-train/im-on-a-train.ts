import * as THREE from 'three';
import * as dat from 'dat.gui';

import {
  SketchThreeObject,
  SketchThreeClass,
  SketchThreeArtworkFunction,
} from '../../types/sketchThree';
import { Artwork } from '../../types/artwork';

// import vertexShader from './shaders/vertex.vert';
// import fragmentShader from './shaders/fragment.frag';

function artwork(this: SketchThreeClass): SketchThreeObject {
  let cube: THREE.Mesh;
  let lights;

  const gui = new dat.GUI();

  const vars = {};

  const createQuad = () => {
    const geometry = new THREE.PlaneBufferGeometry(2, 2);
    const material = new THREE.MeshStandardMaterial({ color: 'hotpink' });
    const quadMesh = new THREE.Mesh(geometry, material);
    quadMesh.rotation.z = Math.PI * -0.5;
    return quadMesh;
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
    const quad = createQuad();
    this.scene.add(quad);
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
