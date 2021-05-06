import * as THREE from 'three';
import { SketchClass } from '../types/sketch';

export default function (this: SketchClass): void {
  this.renderer = new THREE.WebGLRenderer({
    antialias: true,
  });
  this.renderer.setSize(window.innerWidth, window.innerHeight);
  this.renderer.setPixelRatio(window.devicePixelRatio);
  this.renderer.setClearColor(0xc6c6c6);
  document.body.appendChild(this.renderer.domElement);
}
