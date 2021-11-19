import * as THREE from 'three';
import { SketchThreeClass } from '../../types/sketchThree';

export default function (this: SketchThreeClass): void {
  this.clock = new THREE.Clock();
  this.clock.start();
}
