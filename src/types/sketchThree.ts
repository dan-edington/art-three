import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module';

export interface SketchThreeOptions {
  useOrbit?: boolean;
  showStats?: boolean;
  noAnimation?: boolean;
  disableAutoRender?: boolean;
  disableAA?: boolean;
  dimensions?: {
    width: number;
    height: number;
  } | null;
}

export interface SketchThreeClass {
  start(): void;
  setup(): void;
  onFrame(): void;
  init(): void;
  tick(): void;
  options: SketchThreeOptions;
  renderer: THREE.WebGLRenderer;
  camera: THREE.PerspectiveCamera | THREE.OrthographicCamera;
  scene: THREE.Scene;
  clock: THREE.Clock;
  shouldRender: boolean;
  orbit: OrbitControls;
  stats: Stats | null;
}

export interface SketchThreeObject {
  setup(): void;
  onFrame(): void;
  options?: SketchThreeOptions;
}
