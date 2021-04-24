import * as THREE from 'three';

export default function () {
  this.clock = new THREE.Clock();
  this.clock.start();
}