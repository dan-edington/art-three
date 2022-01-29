//@ts-nocheck
import * as THREE from 'three';
// import * as CanvasCapture from 'canvas-capture';

import './noise.js';

import {
  SketchThreeObject,
  SketchThreeClass,
  SketchThreeArtworkFunction,
} from '../../types/sketchThree';
import { Artwork } from '../../types/artwork';

import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';

function artwork(this: SketchThreeClass): SketchThreeObject {
  let lights, curve;
  noise.seed(new Date().getTime());

  const rainbowRoad = new THREE.ShaderMaterial({
    uniforms: {},
    vertexShader,
    fragmentShader,
  });

  const createLights = function () {
    return {
      ambient: new THREE.AmbientLight(0xffffff, 0.25),
      point: new THREE.PointLight(0xffffff, 1.0),
    };
  };

  const createCurve = () => {
    const radius = 20;
    const vecs: Array<THREE.Vector3> = [];
    const pointCount = 8;

    for (let i = 0; i < pointCount; i++) {
      const angle = (i / pointCount) * Math.PI * 2;
      let x = Math.cos(angle) * radius;
      const y = 0; //Math.cos(angle * 4) * 1.5;
      let z = Math.sin(angle) * radius;

      const n = noise.perlin2(x * 2, z * 3) * 30;
      x += n;
      z += n;

      vecs.push(new THREE.Vector3(x, y, z));
    }

    const curve = new THREE.CatmullRomCurve3(vecs, true, 'chordal', 1);

    return curve;
  };

  const createRoad = () => {
    const shape = new THREE.Shape();
    const w = 1;
    const h = 0.001;
    shape.moveTo(0, 0 - w * 0.5);
    shape.lineTo(h, 0 - w * 0.5);
    shape.lineTo(h, w * 0.5);
    shape.lineTo(0, w * 0.5);
    shape.lineTo(0, 0) - w * 0.5;

    const extrudeSettings = {
      bevelEnabled: false,
      steps: 1001,
      extrudePath: curve,
    };

    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    const mesh = new THREE.Mesh(geometry, rainbowRoad);

    return mesh;
  };

  const setup = () => {
    this.renderer.setClearColor(0x000000);
    curve = createCurve();
    this.camera.position.set(0, 10, 50);
    lights = createLights();
    const road = createRoad();
    this.scene.add(road, ...Object.values(lights));
    this.camera.lookAt(road.position);
    // CanvasCapture.init(this.renderer.domElement);
    // CanvasCapture.beginVideoRecord();
  };

  let t = 0;

  // const stopped = false;
  const cameraHeight = 0.08;
  const speed = 0.001;

  const onFrame = () => {
    t += speed;
    const pos = curve.getPoint(t);
    const lookAtPos = curve.getPoint(t + speed);
    lookAtPos.y = cameraHeight;
    this.camera.position.set(pos.x, cameraHeight, pos.z);
    this.camera.lookAt(lookAtPos);
    this.shouldRender = true;

    this.renderer.render(this.scene, this.camera);

    // if (!stopped) {
    //   CanvasCapture.recordFrame();
    // }

    // if (t >= 1.0 && !stopped) {
    //   stopped = true;
    //   CanvasCapture.stopRecord();
    // }
  };

  return {
    setup,
    onFrame,
    options: {
      disableAutoRender: true,
      showStats: true,
      useOrbit: true,
      dimensions: {
        width: 800,
        height: 800,
      },
    },
  };
}

export default function (): Artwork<SketchThreeArtworkFunction> {
  return {
    type: 'THREEJS',
    artworkFunction: artwork,
  };
}
