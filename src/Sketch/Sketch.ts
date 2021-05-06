import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module';
import ResizeHandler from './ResizeHandler';
import Tick from './Tick';
import SetupRenderer from './SetupRenderer';
import SetupCamera from './SetupCamera';
import SetupClock from './SetupClock';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { SketchOptions, SketchClass, SketchObject } from '../types/sketch';

class Sketch implements SketchClass {
  start: () => void;
  setup: () => void | Promise<any>;
  onFrame: () => void;
  init: () => void;
  tick: () => void;
  options: SketchOptions;
  renderer: THREE.WebGLRenderer;
  camera: THREE.PerspectiveCamera | THREE.OrthographicCamera;
  scene: THREE.Scene;
  clock: THREE.Clock;
  shouldRender: boolean;
  orbit: OrbitControls;
  stats: Stats | null;

  constructor(sketchFn: () => SketchObject) {
    const { setup, onFrame, options } = sketchFn.bind(this)();

    const defaultOptions = {
      useOrbit: true,
      showStats: false,
      noAnimation: false,
    };

    this.options = { ...defaultOptions, ...options };
    this.setup = setup;
    this.onFrame = onFrame;
    this.stats = this.options.showStats ? Stats() : null;

    this.start = async () => {
      if (this.stats) {
        this.stats.showPanel(0);
        document.body.appendChild(this.stats.dom);
      }

      this.shouldRender = true;
      this.scene = new THREE.Scene();
      this.scene.add(this.camera);
      this.tick = Tick.bind(this);

      SetupRenderer.bind(this)();
      SetupCamera.bind(this)();
      SetupClock.bind(this)();

      window.addEventListener('resize', ResizeHandler.bind(this));

      await this.setup();

      this.tick();
    };
  }
}

export default Sketch;
