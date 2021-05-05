import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module';
import ResizeHandler from './ResizeHandler';
import Tick from './Tick';
import SetupRenderer from './SetupRenderer';
import SetupCamera from './SetupCamera';
import SetupClock from './SetupClock';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { SketchOptions } from '../types/sketch';
class Sketch {

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

  constructor (sketchFn: Function) {

    const { 
      setup, 
      onFrame, 
      options = {
        useOrbit: true,
        showStats: false,
      } 
    } = sketchFn.bind(this)();

    this.options = options;
    this.setup = setup;
    this.onFrame = onFrame;
    this.stats = this.options.showStats ? Stats() : null;

    this.start = async () => {

      if (this.stats) {
        this.stats.showPanel(0);
        document.body.appendChild(this.stats.dom);
      }

      this.scene = new THREE.Scene();
      this.tick = Tick.bind(this);

      SetupRenderer.bind(this)();
      SetupCamera.bind(this)();
      SetupClock.bind(this)();

      window.addEventListener('resize', ResizeHandler.bind(this));

      await this.setup();

      this.tick();
    }

  }
};

export default Sketch;