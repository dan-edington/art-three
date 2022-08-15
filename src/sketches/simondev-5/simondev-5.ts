import * as THREE from 'three';
import * as dat from 'dat.gui';

import {
  SketchThreeObject,
  SketchThreeClass,
  SketchThreeArtworkFunction,
} from '../../types/sketchThree';
import { Artwork } from '../../types/artwork';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import vertexShader from './shaders/vertex.vert';
import fragmentShader from './shaders/fragment.frag';
import { ShaderMaterial } from 'three';

function artwork(this: SketchThreeClass): SketchThreeObject {
  let object: THREE.Mesh | THREE.Group;

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

  const loadModel = async () => {
    const material = new ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        specularMap: { value: this.scene.background },
      },
      vertexShader,
      fragmentShader,
    });

    const loader = new GLTFLoader();
    const gltf = await loader.loadAsync('simondev/suzanne.glb');
    gltf.scene.traverse((child) => {
      //@ts-ignore
      child.material = material;
    });
    return gltf.scene.children[0] as THREE.Mesh;
  };

  const setup = async () => {
    await createSkybox();
    object = await loadModel();
    this.scene.add(object);
  };

  const onFrame = () => {
    this.shouldRender = true;
    //@ts-ignore
    object.material.uniforms.time.value = this.clock.getElapsedTime();
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
