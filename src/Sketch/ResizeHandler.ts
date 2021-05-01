import * as THREE from 'three';
import Sketch from './Sketch';

export default function(this: Sketch) {
  if (this.camera instanceof THREE.PerspectiveCamera) {
    this.camera.aspect = window.innerWidth / window.innerHeight;
  }
  this.camera.updateProjectionMatrix();
  this.renderer.setSize(window.innerWidth, window.innerHeight);
  this.renderer.setPixelRatio(window.devicePixelRatio);
}