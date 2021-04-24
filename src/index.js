import * as THREE from 'three';

import ResizeHandler from './ResizeHandler';
import Tick from './Tick';
import SetupRenderer from './SetupRenderer';
import SetupCamera from './SetupCamera';
import SetupClock from './SetupClock';

import './index.css';

function Sketch() {

    this.scene = new THREE.Scene();
    this.tick = Tick.bind(this);

    SetupRenderer.bind(this)();
    SetupCamera.bind(this)();
    SetupClock.bind(this)();

    window.addEventListener('resize', ResizeHandler.bind(this));

    this.addLights = function () {
        this.lights = {
            ambient: new THREE.AmbientLight(0xffffff, 0.25),
            point: new THREE.PointLight(0xffffff, 1.0),
        }
        this.scene.add(this.lights.ambient);
        this.scene.add(this.lights.point);
        this.lights.point.position.set(0, 2, 2);
    }

    this.createCube = function () {
        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshStandardMaterial( { color: 'tomato' } );
        return new THREE.Mesh(geometry, material);  
    }

    this.setup = function () {
        this.addLights();
        this.cube = this.createCube();
        this.scene.add(this.cube);
    }

    this.onFrame = function () {
        this.cube.rotation.y = Math.PI * this.clock.getElapsedTime() * 0.1;
    }

    return {
        start: () => {
            this.setup();
            this.tick();
        },
    }

};

const s = new Sketch();
s.start();