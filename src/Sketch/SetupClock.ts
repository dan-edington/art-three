import * as THREE from 'three';
import { SketchClass } from '../types/sketch';

export default function (this: SketchClass): void {
  this.clock = new THREE.Clock();
  this.clock.start();
}
