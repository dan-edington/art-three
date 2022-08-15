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
  let lights;

  const gui = new dat.GUI();

  const vars = {
    size: 500.0,
    speed: 1.0,
    transparency: 0.85,
  };

  const loader = new THREE.TextureLoader();
  const diffuse = loader.load('simondev/ericcantona.jpg');

  const createCube = function () {
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.ShaderMaterial({
      uniforms: {
        diffuse: { value: diffuse },
        time: { value: 0.0 },
        size: { value: vars.size },
        speed: { value: vars.speed },
        transparency: { value: vars.transparency },
      },
      vertexShader,
      fragmentShader,
    });
    return new THREE.Mesh(geometry, material);
  };

  const createLights = function () {
    return {
      ambient: new THREE.AmbientLight(0xffffff, 0.25),
      point: new THREE.PointLight(0xffffff, 1.0),
    };
  };

  const setup = () => {
    lights = createLights();
    lights.point.position.set(2, 2, 2);
    cube = createCube();
    this.scene.add(cube, ...Object.values(lights));

    gui.add(vars, 'speed', 0.0, 2.0, 0.1).onChange(() => {
      //@ts-ignore;
      cube.material.uniforms.speed.value = vars.speed;
    });

    gui.add(vars, 'size', 1.0, 1000.0, 1.0).onChange(() => {
      //@ts-ignore;
      cube.material.uniforms.size.value = vars.size;
    });

    gui.add(vars, 'transparency', 0.0, 1.0, 0.05).onChange(() => {
      //@ts-ignore;
      cube.material.uniforms.transparency.value = vars.transparency;
    });
  };

  const onFrame = () => {
    //@ts-ignore;
    cube.material.uniforms.time.value = this.clock.getElapsedTime();
    this.shouldRender = true;
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
