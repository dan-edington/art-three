interface Sketch {
  start: Function
  setup: Function
  onFrame: Function
  init: Function
  tick: Function
  renderer: THREE.WebGLRenderer
  camera: THREE.PerspectiveCamera | THREE.OrthographicCamera
  scene: THREE.Scene
  clock: THREE.Clock
  orbit: any
  useOrbit: boolean
}

declare module "*.png";
declare module "*.frag";
declare module "*.vert";