// @ts-nocheck

import * as THREE from 'three';
import * as dat from 'dat.gui';

import { SketchThreeObject, SketchThreeClass } from '../../types/sketchThree';
import { Artwork } from '../../types/artwork';

function artwork (this: SketchThreeClass): SketchThreeObject {
  let cube: THREE.Mesh;
  let lights;

  const gui = new dat.GUI();

  const vars = {
    rotation: 0,
  };

  const createCube = function () {
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshStandardMaterial({ color: 'hotpink' });
    return new THREE.Mesh(geometry, material);
  };

  const createLights = function () {
    return {
      ambient: new THREE.AmbientLight(0xffffff, 0.25),
      point: new THREE.PointLight(0xffffff, 1.0),
    };
  };

  const setup = () => {
    gui.add(vars, 'rotation', 0, Math.PI * 2, 0.001);
    lights = createLights();
    lights.point.position.set(2, 2, 2);
    cube = createCube();
    this.scene.add(cube, ...Object.values(lights));
  };

  const onFrame = () => {
    if (cube.rotation.y !== vars.rotation) {
      cube.rotation.y = vars.rotation;
      this.shouldRender = true;
    }
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

export default function (): Artwork {
  return {
    type: 'THREEJS',
    artworkFunction: artwork,
  };
}
