// @ts-nocheck
import * as THREE from 'three';

import { SketchThreeObject, SketchThreeClass } from '../../types/sketchThree';
import { Artwork } from '../../types/artwork';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { BufferGeometry } from 'three';

function portal(this: SketchThreeClass): SketchThreeObject {
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
        t.encoding = THREE.sRGBEncoding;
        resolve(t);
      });
    });

    const lampMaterial = new THREE.MeshBasicMaterial({ color: 0xfffffc });
    const portalMaterial = new THREE.MeshBasicMaterial({ color: 0xe4fdff, side: THREE.DoubleSide });

    await new Promise((resolve) => {
      new GLTFLoader().load('./scene.glb', (gltf) => {
        gltf.scene.traverse((child) => {
          child.material = new THREE.MeshBasicMaterial({ map: texture });
        });

        const emissionPortal = gltf.scene.children.find((child) => {
          return child.name === 'emissionPortal';
        });

        const emissionStreetLamp1 = gltf.scene.children.find((child) => {
          return child.name === 'emissionStreetLamp1';
        });

        const emissionStreetLamp2 = gltf.scene.children.find((child) => {
          return child.name === 'emissionStreetLamp2';
        });

        emissionPortal?.material = portalMaterial;
        emissionStreetLamp1?.material = lampMaterial;
        emissionStreetLamp2?.material = lampMaterial;

        this.scene.add(gltf.scene);

        resolve();
      });
    });

    lights = createLights();
    this.scene.add(...Object.values(lights));
    this.renderer.setClearColor(0x464646);
    this.renderer.outputEncoding = THREE.sRGBEncoding;
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

export default function (): Artwork {
  return {
    type: 'THREEJS',
    artworkFunction: portal,
  };
}
