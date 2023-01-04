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
  noise.seed(this.noiseSeed);
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

  const createLightLine = () => {
    const radius = 20;
    const vecs: Array<THREE.Vector3> = [];
    const pointCount = 120;

    let prevX = 0;
    let prevY = 0;
    let prevZ = 0;

    for (let i = 0; i < pointCount; i++) {
      // const angle = (i / pointCount) * Math.PI * 2;
      // const x = Math.cos(angle) * radius;
      // const y = Math.cos(angle * 4) * 1.5;
      // const z = Math.sin(angle) * radius;
      const x = prevX + noise.perlin2((prevX + i) * 0.01, (prevZ + i) * 0.01);
      console.log(noise.perlin2(prevX + i, prevZ + i));
      const y = 0;
      const z = prevZ - 2;

      vecs.push(new THREE.Vector3(x, y, z));

      prevX = x;
      prevY = y;
      prevZ = z;
    }

    const lightLine = new THREE.CatmullRomCurve3(vecs, false, 'centripetal', 2);

    const geometry = new THREE.TubeGeometry(lightLine, 200, 1, 100, false);
    const material = new THREE.ShaderMaterial({ vertexShader, fragmentShader });

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

  const setup = () => {
    createLights();

    floor = createFloor();
    floor.rotation.x = TAU * -0.25;
    this.scene.add(floor);

    const c = createLightLine();
    c.scale.set(0.005, 0.005, 0.005);
    c.position.z = 0.5;
    c.position.y = 0.009;
    this.scene.add(c);

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
