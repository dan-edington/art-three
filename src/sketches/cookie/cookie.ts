// @ts-nocheck

import * as THREE from 'three';
import { SketchThreeObject, SketchThreeClass } from '../../types/sketchThree';
import { Artwork } from '../../types/artwork';

import frag from './fragment.frag';
import vert from './vertex.vert';

import vertnoise from './verticalnoise.jpg';

function cookie(this: SketchThreeClass): SketchThreeObject {
  let cookie: THREE.Mesh;

  const vars = {
    uTime: 0,
  };

  const createCookie = function () {
    const geometry = new THREE.SphereBufferGeometry(1, 128, 128);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: vars.uTime },
        uVertNoise: { value: new THREE.TextureLoader().load(vertnoise) },
      },
      vertexShader: vert,
      fragmentShader: frag,
    });
    return new THREE.Mesh(geometry, material);
  };

  const setup = () => {
    this.camera.position.z = 2;
    cookie = createCookie();
    this.scene.add(cookie);
  };

  const onFrame = () => {
    vars.uTime = this.clock.getElapsedTime();
    cookie.material.uniforms.uTime.value = vars.uTime;
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

export default function (): Artwork {
  return {
    type: 'THREEJS',
    artworkFunction: cookie,
  };
}
