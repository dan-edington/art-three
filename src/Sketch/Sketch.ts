import * as THREE from 'three';
import ResizeHandler from './ResizeHandler';
import Tick from './Tick';
import SetupRenderer from './SetupRenderer';
import SetupCamera from './SetupCamera';
import SetupClock from './SetupClock';

class Sketch implements SketchClass {

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

  constructor (sketchFn: Function) {

    const { 
      setup, 
      onFrame, 
      options = {
        useOrbit: true,
      } 
    } = sketchFn.bind(this)();

    this.options = options;
    this.setup = setup;
    this.onFrame = onFrame;

    this.start = async () => {
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