import * as THREE from 'three';
import { SketchThreeClass } from '../../types/sketchThree';

export default function (this: SketchThreeClass): void {
  if (this.camera instanceof THREE.PerspectiveCamera) {
    this.camera.aspect = window.innerWidth / window.innerHeight;
  }
  this.camera.updateProjectionMatrix();
  this.renderer.setSize(window.innerWidth, window.innerHeight);
  this.renderer.setPixelRatio(window.devicePixelRatio);
  this.shouldRender = true;
}
