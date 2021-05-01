import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Sketch from './Sketch';

export default function (this: Sketch) {
  this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  this.camera.position.z = 2;
  this.orbit = this.options.useOrbit ? new OrbitControls(this.camera, this.renderer.domElement) : null;
}