import * as THREE from 'three';
import { SketchThreeClass } from '../../types/sketchThree';

export default function (this: SketchThreeClass): void {
  this.renderer = new THREE.WebGLRenderer({
    antialias: this.options.disableAA ? false : true,
    preserveDrawingBuffer: false,
    powerPreference: 'high-performance',
  });
  this.renderer.domElement.setAttribute('id', 'sketch-three-canvas');

  const containerElement = document.createElement('div');
  containerElement.id = 'threeSketch';
  document.body.appendChild(containerElement);
  containerElement.appendChild(this.renderer.domElement);

  this.renderer.outputEncoding = THREE.sRGBEncoding;
  if (this.options.dimensions) {
    this.renderer.setSize(this.options.dimensions.width, this.options.dimensions.height);
  } else {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
  this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  this.renderer.setClearColor(0xc6c6c6);
}
