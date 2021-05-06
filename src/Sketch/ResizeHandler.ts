import * as THREE from 'three';
import { SketchClass } from '../types/sketch';

export default function (this: SketchClass): void {
  if (this.camera instanceof THREE.PerspectiveCamera) {
    this.camera.aspect = window.innerWidth / window.innerHeight;
  }
  this.camera.updateProjectionMatrix();
  this.renderer.setSize(window.innerWidth, window.innerHeight);
  this.renderer.setPixelRatio(window.devicePixelRatio);
  this.shouldRender = true;
}
