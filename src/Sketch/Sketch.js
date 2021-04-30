import * as THREE from 'three';

import ResizeHandler from './ResizeHandler';
import Tick from './Tick';
import SetupRenderer from './SetupRenderer';
import SetupCamera from './SetupCamera';
import SetupClock from './SetupClock';

class Sketch {

  constructor (sketchFn) {

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

    this.useOrbit = options.useOrbit;

    this.init = function () {
      this.scene = new THREE.Scene();
      this.tick = Tick.bind(this);

      SetupRenderer.bind(this)();
      SetupCamera.bind(this)();
      SetupClock.bind(this)();

      window.addEventListener('resize', ResizeHandler.bind(this));
    };

    return {
      start: async () => {
        this.init();
        await this.setup();
        this.tick();
      },
    };

  }
};

export default Sketch;