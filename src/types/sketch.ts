
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module';

export interface Sketch {
  start: Function
  setup: Function
  onFrame: Function
  init: Function
  tick: Function
  options: SketchOptions
  renderer: THREE.WebGLRenderer
  camera: THREE.PerspectiveCamera | THREE.OrthographicCamera
  scene: THREE.Scene
  clock: THREE.Clock
  orbit: OrbitControls
  stats: Stats | null
}

export interface SketchOptions {
  useOrbit?: boolean
  showStats?: boolean
}

export interface SketchFunction {
  setup: Function
  onFrame: Function
  options?: SketchOptions
  bind?: Function
}