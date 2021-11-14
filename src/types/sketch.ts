import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module';

export interface SketchClass {
  start(): void;
  setup(): void;
  onFrame(): void;
  init(): void;
  tick(): void;
  options: SketchOptions;
  renderer: THREE.WebGLRenderer;
  camera: THREE.PerspectiveCamera | THREE.OrthographicCamera;
  scene: THREE.Scene;
  clock: THREE.Clock;
  shouldRender: boolean;
  orbit: OrbitControls;
  stats: Stats | null;
}

export interface SketchOptions {
  useOrbit?: boolean;
  showStats?: boolean;
  noAnimation?: boolean;
  disableAutoRender?: boolean;
}

export interface SketchObject {
  setup(): void;
  onFrame(): void;
  options?: SketchOptions;
}
