import * as THREE from 'three';
import Sketch from './Sketch';

export default function (this: Sketch) {
  this.clock = new THREE.Clock();
  this.clock.start();
}