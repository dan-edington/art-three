// @ts-nocheck

import * as THREE from 'three';
import * as dat from 'dat.gui';
import { SketchObject, SketchClass } from '../../types/sketch';

import blobFragment from './shaders/fragment.frag';
import blobVertex from './shaders/vertex.vert';

export default function (this: SketchClass): SketchObject {
  let blob: THREE.Mesh;

  const gui = new dat.GUI();

  const vars = {
    rotation: 0,
    time: 0.0,
  };

  const createBlob = function () {
    const geometry = new THREE.SphereBufferGeometry(1, 64, 64);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: vars.time },
      },
      vertexShader: blobVertex,
      fragmentShader: blobFragment,
    });
    return new THREE.Mesh(geometry, material);
  };

  const setup = () => {
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
