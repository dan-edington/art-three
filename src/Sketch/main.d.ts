
interface OrbitControls {

  object: THREE.Camera;
  domElement: HTMLElement | HTMLDocument;

  // API
  enabled: boolean;
  target: THREE.Vector3;

  // deprecated
  center: THREE.Vector3;

  minDistance: number;
  maxDistance: number;

  minZoom: number;
  maxZoom: number;

  minPolarAngle: number;
  maxPolarAngle: number;

  minAzimuthAngle: number;
  maxAzimuthAngle: number;

  enableDamping: boolean;
  dampingFactor: number;

  enableZoom: boolean;
  zoomSpeed: number;

  enableRotate: boolean;
  rotateSpeed: number;

  enablePan: boolean;
  panSpeed: number;
  screenSpacePanning: boolean;
  keyPanSpeed: number;

  autoRotate: boolean;
  autoRotateSpeed: number;

  enableKeys: boolean;
  keys: { LEFT: string; UP: string; RIGHT: string; BOTTOM: string };
  mouseButtons: { LEFT: THREE.MOUSE; MIDDLE: THREE.MOUSE; RIGHT: THREE.MOUSE };
  touches: { ONE: THREE.TOUCH; TWO: THREE.TOUCH };

  update(): boolean;

  listenToKeyEvents(domElement: HTMLElement): void;

  saveState(): void;

  reset(): void;

  dispose(): void;

  getPolarAngle(): number;

  getAzimuthalAngle(): number;

  // EventDispatcher mixins
  addEventListener(type: string, listener: (event: any) => void): void;

  hasEventListener(type: string, listener: (event: any) => void): boolean;

  removeEventListener(type: string, listener: (event: any) => void): void;

  dispatchEvent(event: { type: string; target: any }): void;
}
interface Sketch {
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

interface SketchOptions {
  useOrbit?: boolean
  showStats?: boolean
}

interface SketchFunction {
  setup: Function
  onFrame: Function
  options?: SketchOptions
  bind?: Function
}

declare module "*.png"
declare module "*.frag"
declare module "*.vert"