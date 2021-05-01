import * as THREE from 'three';

export default function(this: SketchClass) {
  if (this.camera instanceof THREE.PerspectiveCamera) {
    this.camera.aspect = window.innerWidth / window.innerHeight;
  }
  this.camera.updateProjectionMatrix();
  this.renderer.setSize(window.innerWidth, window.innerHeight);
  this.renderer.setPixelRatio(window.devicePixelRatio);
}