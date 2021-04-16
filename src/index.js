import * as THREE from 'three';
import resizeHandlers from './resizeHandlers'
import initCamera from './camera';
import animate from './animate';

const scene = new THREE.Scene();
const camera = initCamera();

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);


const RENAMETHISPLZ = {
    scene,
    camera,
    renderer
}


resizeHandlers(RENAMETHISPLZ);
animate(RENAMETHISPLZ);