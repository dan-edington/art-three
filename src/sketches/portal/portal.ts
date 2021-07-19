// @ts-nocheck
import * as THREE from 'three';

import { SketchObject, SketchClass } from '../../types/sketch';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { BufferGeometry } from 'three';

export default function (this: SketchClass): SketchObject {
  let lights;

  const vars = {};

  const createLights = function () {
    return {
      ambient: new THREE.AmbientLight(0xffffff, 1),
    };
  };

  const setup = async () => {
    const texture = await new Promise((resolve) => {
      new THREE.TextureLoader().load('./bake.jpg', (t) => {
        t.flipY = false;
        resolve(t);
      });
    });

    await new Promise((resolve) => {
      new GLTFLoader().load('./scene.glb', (gltf) => {
        gltf.scene.traverse((child) => {
          child.material = new THREE.MeshBasicMaterial({ map: texture });
        });
        this.scene.add(gltf.scene);
        resolve();
      });
    });

    lights = createLights();
    this.scene.add(...Object.values(lights));
    this.renderer.setClearColor(0x000000);
  };

  const onFrame = () => {
    return null;
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
