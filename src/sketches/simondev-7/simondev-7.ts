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

  const gui = new dat.GUI();

  const vars = {};

  const createSkybox = () => {
    return new Promise((resolve, reject) => {
      const loader = new THREE.CubeTextureLoader();
      loader.load(
        [
          '/simondev/Cold_Sunset__Cam_2_Left+X.png',
          '/simondev/Cold_Sunset__Cam_3_Right-X.png',
          '/simondev/Cold_Sunset__Cam_4_Up+Y.png',
          '/simondev/Cold_Sunset__Cam_5_Down-Y.png',
          '/simondev/Cold_Sunset__Cam_0_Front+Z.png',
          '/simondev/Cold_Sunset__Cam_1_Back-Z.png',
        ],
        (texture) => {
          this.scene.background = texture;
          resolve(0);
        },
      );
    });
  };

  const createCube = () => {
    const geometry = new THREE.BoxBufferGeometry(1, 1, 1, 2, 1, 1);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        specularMap: { value: this.scene.background },
      },
      vertexShader,
      fragmentShader,
    });
    return new THREE.Mesh(geometry, material);
  };

  const setup = async () => {
    this.camera.position.z = 1.5;
    await createSkybox();
    cube = createCube();
    this.scene.add(cube);
  };

  const onFrame = () => {
    this.shouldRender = true;
    //@ts-ignore
    cube.material.uniforms.time.value = this.clock.getElapsedTime();
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
