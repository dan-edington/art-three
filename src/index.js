import * as THREE from 'three';
import * as dat from 'dat.gui';

import ResizeHandler from './ResizeHandler';
import Tick from './Tick';
import SetupRenderer from './SetupRenderer';
import SetupCamera from './SetupCamera';
import SetupClock from './SetupClock';

import './index.css';

const createCube = function () {
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshStandardMaterial( { color: 'tomato' } );
    return new THREE.Mesh(geometry, material);  
}

const createLights = function () {
    return {
        ambient: new THREE.AmbientLight(0xffffff, 0.25),
        point: new THREE.PointLight(0xffffff, 1.0),
    }
}

function Sketch() {

    this.variables = {
        rotation: 0,
    };
    
    this.init = function () {
        this.scene = new THREE.Scene();
        this.tick = Tick.bind(this);

        SetupRenderer.bind(this)();
        SetupCamera.bind(this)();
        SetupClock.bind(this)();

        window.addEventListener('resize', ResizeHandler.bind(this));
        
        this.gui = new dat.GUI();
    }

    this.setup = function () {
        this.gui.add(this.variables, 'rotation', 0, Math.PI * 2, 0.001);

        this.lights = createLights();
        this.lights.point.position.set(2, 2, 2);

        this.cube = createCube();

        this.scene.add(this.cube, ...Object.values(this.lights));
    }

    this.onFrame = function () {
        this.cube.rotation.y = this.variables.rotation;
    }

    return {
        start: () => {
            this.init();
            this.setup();
            this.tick();
        },
    }

};

const s = new Sketch();
s.start();