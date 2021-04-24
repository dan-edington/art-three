import * as THREE from 'three';

import ResizeHandler from './ResizeHandler';
import Tick from './Tick';
import SetupRenderer from './SetupRenderer';
import SetupCamera from './SetupCamera';
import SetupClock from './SetupClock';

class Sketch {

  constructor (
    sketchFunctions,
    options = {
      useOrbit: true,
    }
  ) {

    this.useOrbit = options.useOrbit;

    this.init = function () {
      this.scene = new THREE.Scene();
      this.tick = Tick.bind(this);

      SetupRenderer.bind(this)();
      SetupCamera.bind(this)();
      SetupClock.bind(this)();

      window.addEventListener('resize', ResizeHandler.bind(this));

      this.sketchFunctions = sketchFunctions.bind(this)();
    };

    return {
      start: () => {
        this.init();
        this.sketchFunctions.setup();
        this.tick();
      },
    };

  }
};

export default Sketch;