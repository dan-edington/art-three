// @ts-nocheck

import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import * as dat from 'dat.gui';
import { SketchObject, SketchClass } from '../../types/sketch';

export default function (this: SketchClass): SketchObject {
  const toresCount = 16;
  let tores: [THREE.Mesh] = [];
  let lights;
  let camera;
  let renderScene, bloomPass, composer;
  const gui = new dat.GUI();

  const vars = {
    radiusMax: 0.1,
    amountScale: 5,
    amountAngleScale: 0.1,
  };

  const params = {
    exposure: 1,
    bloomStrength: 1.5,
    bloomThreshold: 0,
    bloomRadius: 0,
  };

  const createLights = function () {
    return {
      ambient: new THREE.AmbientLight(0xffffff, 0.5),
      point: new THREE.PointLight(0xffffff, 1.0),
    };
  };

  const createTores = function () {
    let torus = {};
    for (let i = 0; i < toresCount; i++) {
      const geometry = new THREE.TorusGeometry(i + 1, 0.1, 16, 128);
      const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(),
      });
      torus = new THREE.Mesh(geometry, material);
      torus.rotation.x = Math.PI / 2;
      torus.position.set(0, 0, 0);
      tores.push(torus);
    }
    return tores;
  };

  const setup = () => {
    gui.add(vars, 'radiusMax').min(0.001).max(1).step(0.001);
    gui.add(vars, 'amountScale').min(0.001).max(10).step(0.001);
    gui.add(vars, 'amountAngleScale').min(0.001).max(1).step(0.001);
    // gui.addColor(palette, 'bgColor').onChange(() => {
    //   this.renderer.setClearColor(palette.bgColor);
    // });
    // gui.addColor(palette, 'ringColor').onChange(() => {
    //   tores.forEach((t) => {
    //     t.material.color.set(palette.ringColor);
    //   });
    // });
    this.renderer.setClearColor(new THREE.Color(0x000000));
    camera = this.camera;
    camera.position.set(0, 0, 15);
    lights = createLights();
    lights.point.position.set(2, 2, 2);
    tores = createTores();
    this.scene.add(...tores, ...Object.values(lights));

    renderScene = new RenderPass(this.scene, this.camera);
    bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.5,
      0.4,
      0.85,
    );
    bloomPass.threshold = params.bloomThreshold;
    bloomPass.strength = params.bloomStrength;
    bloomPass.radius = params.bloomRadius;

    composer = new EffectComposer(this.renderer);
    composer.addPass(renderScene);
    composer.addPass(bloomPass);
  };

  const onFrame = () => {
    const currentTime = this.clock.getElapsedTime();
    for (let i = 0; i < tores.length; i++) {
      const amount = Math.sin(currentTime + (i + 1) * vars.amountAngleScale) * vars.amountScale;
      tores[i].position.y = amount;
      const amountScaled = amount * vars.radiusMax;
      tores[i].scale.set(amountScaled, amountScaled, amountScaled);
      tores[i].material.color.setHSL(Math.sin(currentTime) * 0.5 + 0.5, 1, 0.5);
    }

    this.shouldRender = true;

    composer.render();
  };

  return {
    setup,
    onFrame,
    options: {
      showStats: false,
      useOrbit: false,
      disableAutoRender: true,
    },
  };
}
