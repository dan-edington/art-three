import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module';
import ResizeHandler from './ResizeHandler';
import Tick from './Tick';
import SetupRenderer from './SetupRenderer';
import SetupCamera from './SetupCamera';
import SetupClock from './SetupClock';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { SketchThreeOptions, SketchThreeClass, SketchThreeObject } from '../../types/sketchThree';

class Sketch implements SketchThreeClass {
  start: () => void;
  setup: () => void | Promise<any>;
  onFrame: () => void;
  init: () => void;
  tick: () => void;
  options: SketchThreeOptions;
  renderer: THREE.WebGLRenderer;
  camera: THREE.PerspectiveCamera | THREE.OrthographicCamera;
  scene: THREE.Scene;
  clock: THREE.Clock;
  shouldRender: boolean;
  orbit: OrbitControls;
  stats: Stats | null;
  seed: number;

  constructor(sketchFn: () => SketchThreeObject, seed: number) {
    const { setup, onFrame, options } = sketchFn.bind(this, seed)();

    const defaultOptions: SketchThreeOptions = {
      useOrbit: true,
      showStats: false,
      noAnimation: false,
      disableAutoRender: false,
      dimensions: null,
      disableAA: false,
    };

    this.options = { ...defaultOptions, ...options };
    this.setup = setup;
    this.onFrame = onFrame;
    this.stats = this.options.showStats ? Stats() : null;
    this.seed = seed;

    this.start = async () => {
      if (this.stats) {
        this.stats.showPanel(0);
        document.body.appendChild(this.stats.dom);
      }

      this.shouldRender = true;
      this.scene = new THREE.Scene();
      this.tick = Tick.bind(this);

      SetupRenderer.bind(this)();
      SetupClock.bind(this)();

      SetupCamera.bind(this)();
      this.scene.add(this.camera);

      window.addEventListener('resize', ResizeHandler.bind(this));

      await this.setup();

      this.tick();
    };
  }
}

export default Sketch;
