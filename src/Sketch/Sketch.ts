import * as THREE from 'three';
import ResizeHandler from './ResizeHandler';
import Tick from './Tick';
import SetupRenderer from './SetupRenderer';
import SetupCamera from './SetupCamera';
import SetupClock from './SetupClock';

class Sketch implements Sketch {

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

  constructor (sketchFn: Function) {

    const { 
      setup, 
      onFrame, 
      options = {
        useOrbit: true,
      } 
    } = sketchFn.bind(this)();

    this.setup = setup;
    this.onFrame = onFrame;
    this.useOrbit = options.useOrbit;

    this.init = function () {
      this.scene = new THREE.Scene();
      this.tick = Tick.bind(this);

      SetupRenderer.bind(this)();
      SetupCamera.bind(this)();
      SetupClock.bind(this)();

      window.addEventListener('resize', ResizeHandler.bind(this));
    };

    this.start = async () => {
      this.init();
      await this.setup();
      this.tick();
    }

  }
};

export default Sketch;