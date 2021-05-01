import * as THREE from 'three';

export default function (this: Sketch) {
  this.clock = new THREE.Clock();
  this.clock.start();
}