//@ts-nocheck
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
import '../../util/noise.js';

const TAU = Math.PI * 2;

function artwork(this: SketchThreeClass): SketchThreeObject {
  let floor: THREE.Mesh;
  let lights;

  const gui = new dat.GUI();

  const vars = {};

  const createFloor = () => {
    const geometry = new THREE.PlaneBufferGeometry();
    const material = new THREE.MeshStandardMaterial({ color: 0x5c5c5c });
    return new THREE.Mesh(geometry, material);
  };

  const positionCamera = () => {
    this.camera.position.set(0, 0.71, 1);
    this.camera.lookAt(0, 0, 0);
  };

  const createLightLine = (lineNumber: number) => {
    // random radius between 0.005 and 0.01
    const radius = 0.005 + noise.simplex2(lineNumber, lineNumber * 2) * 0.005;

    const vecs: Array<THREE.Vector3> = [];

    vecs.push(new THREE.Vector3(0, 0, 0));
    vecs.push(new THREE.Vector3(0, 0, -0.75));
    vecs.push(new THREE.Vector3(-0.75, 0, -0.75));

    // add a small amount of noise to vecs
    vecs.forEach((v) => {
      v.x += Math.random() * 0.15;
      v.z += Math.random() * 0.15;
    });

    const lightLine = new THREE.CatmullRomCurve3(vecs, false, 'catmullrom', 0.5);

    const geometry = new THREE.TubeGeometry(lightLine, 60, radius, 100, false);
    const material = new THREE.MeshBasicMaterial({
      blending: THREE.MultiplyBlending,
      color: 0xffe400,
      opacity: Math.random(),
      transparent: true,
    });

    return new THREE.Mesh(geometry, material);
  };

  const createLights = () => {
    const lights = {
      ambient: new THREE.AmbientLight(0xffffff, 0.25),
      point: new THREE.PointLight(0xffffff, 1.0),
    };

    lights.point.position.set(2, 2, 2);

    this.scene.background = new THREE.Color(0x030b11);
    this.scene.add(...Object.values(lights));
  };

  const setupFog = () => {
    this.scene.fog = new THREE.Fog(0x030b11, 0.1, 1.5);
  };

  const setup = () => {
    noise.seed(this.seed);
    createLights();

    floor = createFloor();
    floor.rotation.x = TAU * -0.25;
    this.scene.add(floor);

    for (let i = 0; i < 10; i++) {
      const c = createLightLine(i);
      c.position.z = 0.5;
      c.position.y = 0.009;
      this.scene.add(c);
    }

    // setupFog();
    positionCamera();
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
