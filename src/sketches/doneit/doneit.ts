// @ts-nocheck

import * as THREE from 'three';
import * as dat from 'dat.gui';
import { SketchThreeObject, SketchThreeClass } from '../../types/sketchThree';
import { Artwork } from '../../types/artwork';

import blobFragment from './shaders/fragment.frag';
import blobVertex from './shaders/vertex.vert';

function doneit(this: SketchThreeClass): SketchThreeObject {
  let blob: THREE.Mesh;

  const gui = new dat.GUI();

  const vars = {
    uImage: null,
    time: 0.0,
  };

  const createBlob = function () {
    const geometry = new THREE.SphereBufferGeometry(1, 64, 64);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: vars.time },
        uImage: { value: vars.uImage },
      },
      vertexShader: blobVertex,
      fragmentShader: blobFragment,
    });
    return new THREE.Mesh(geometry, material);
  };

  const loadTextures = function () {
    vars.uImage = new THREE.TextureLoader().load('https://picsum.photos/400');
  };

  const setup = () => {
    loadTextures();
    blob = createBlob();
    this.scene.add(blob);
  };

  const onFrame = () => {
    //blob.rotation.y = blob.rotation.y + 0.005;
    vars.time = this.clock.getElapsedTime();
    blob.material.uniforms.time.value = vars.time;
    this.shouldRender = true;
  };

  return {
    setup,
    onFrame,
    options: {
      showStats: false,
      useOrbit: true,
    },
  };
}

export default function (): Artwork<SketchThreeObject> {
  return {
    type: 'THREEJS',
    artworkFunction: doneit,
  };
}
