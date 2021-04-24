import * as THREE from 'three';

export default function () {
  this.renderer = new THREE.WebGLRenderer();
  this.renderer.setSize(window.innerWidth, window.innerHeight);
  this.renderer.setClearColor(0xc6c6c6);
  document.body.appendChild(this.renderer.domElement);
}