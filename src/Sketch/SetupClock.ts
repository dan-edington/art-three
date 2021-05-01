import * as THREE from 'three';

export default function (this: SketchClass) {
  this.clock = new THREE.Clock();
  this.clock.start();
}