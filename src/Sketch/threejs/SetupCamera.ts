import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { SketchThreeClass } from '../../types/sketchThree';

export default function (this: SketchThreeClass): void {
  if (this.options.dimensions) {
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.options.dimensions.width / this.options.dimensions.height,
      0.1,
      200,
    );
  } else {
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 200);
  }
  this.camera.position.z = 2;
  this.orbit = this.options.useOrbit
    ? new OrbitControls(this.camera, this.renderer.domElement)
    : null;
  if (this.orbit) {
    this.orbit.addEventListener('change', () => {
      this.shouldRender = true;
    });
  }
}
