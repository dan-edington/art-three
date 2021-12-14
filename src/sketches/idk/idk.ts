//@ts-nocheck

import * as THREE from 'three';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import * as dat from 'dat.gui';
import { SketchThreeObject, SketchThreeClass } from '../../types/sketchThree';
import { Artwork } from '../../types/artwork';

import fragmentShader from './fragment.glsl';
import vertexShader from './vertex.glsl';

function idk(this: SketchThreeClass): SketchThreeObject {
  const toresCount = 16;
  let tores: [THREE.Mesh] = [];
  let lights;
  let camera;
  let renderScene, bloomPass, fxaa, composer;
  const gui = new dat.GUI();

  const vars = {
    radiusScale: 0.1,
    amountScale: 5,
    amountAngleScale: 0.1,
    startHue: 0,
    hueRange: 0.501,
    speed: 0.808,
    bgColor: new THREE.Color(0x000000),
  };

  const bloomParams = {
    bloomStrength: 10,
    bloomThreshold: 0,
    bloomRadius: 0,
    exposure: 0.988,
  };

  const createLights = function () {
    return {
      ambient: new THREE.AmbientLight(0xffffff, 0.5),
      point: new THREE.PointLight(0xffffff, 1.0),
    };
  };

  const createTores = function () {
    let torus = {};

    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(),
    });

    // const material = new THREE.ShaderMaterial({
    //   uniforms: {
    //     time: { value: 0 },
    //   },
    //   vertexShader,
    //   fragmentShader,
    // });

    for (let i = 0; i < toresCount; i++) {
      const geometry = new THREE.TorusGeometry(i + 1, 0.1, 8, 64);
      // torus = new THREE.Mesh(geometry, material);
      torus = new THREE.Points(geometry, material);
      torus.rotation.x = Math.PI / 2;
      torus.position.set(0, 0, 0);
      tores.push(torus);
    }
    return tores;
  };

  const setup = () => {
    this.renderer.toneMapping = THREE.CineonToneMapping;
    this.renderer.physicallyCorrectLights = true;
    this.renderer.toneMappingExposure = bloomParams.exposure;
    this.renderer.setClearColor(vars.bgColor);

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
    bloomPass.threshold = bloomParams.bloomThreshold;
    bloomPass.strength = bloomParams.bloomStrength;
    bloomPass.radius = bloomParams.bloomRadius;

    fxaa = new ShaderPass(FXAAShader);
    fxaa.uniforms['resolution'].value.set(
      1 / (window.innerWidth * devicePixelRatio),
      1 / (window.innerHeight * devicePixelRatio),
    );
    fxaa.renderToScreen = true;

    composer = new EffectComposer(this.renderer);
    composer.addPass(renderScene);
    composer.addPass(fxaa);
    composer.addPass(bloomPass);

    const bloomFolder = gui.addFolder('Bloom');
    const settingsFolder = gui.addFolder('Settings');
    settingsFolder.add(vars, 'radiusScale').min(0.001).max(1).step(0.001);
    settingsFolder.add(vars, 'amountScale').min(0.001).max(10).step(0.001);
    settingsFolder.add(vars, 'amountAngleScale').min(0.001).max(1).step(0.001);
    settingsFolder.add(vars, 'startHue').min(0).max(1).step(0.001);
    settingsFolder.add(vars, 'hueRange').min(0).max(1).step(0.001);
    settingsFolder.add(vars, 'speed').min(0).max(3).step(0.001);
    settingsFolder.addColor(vars, 'bgColor').onChange((value) => {
      const c = new THREE.Color(value);
      console.log(c);
      this.renderer.setClearColor(c);
    });

    bloomFolder
      .add(bloomParams, 'exposure')
      .min(0)
      .max(4)
      .step(0.001)
      .onChange((value) => {
        this.renderer.toneMappingExposure = Math.pow(value, 4.0);
      });
    bloomFolder
      .add(bloomParams, 'bloomStrength', 0, 10)
      .step(0.1)
      .onChange(() => {
        bloomPass.strength = bloomParams.bloomStrength;
      });
    bloomFolder
      .add(bloomParams, 'bloomThreshold', 0, 1)
      .step(0.01)
      .onChange(() => {
        bloomPass.threshold = bloomParams.bloomThreshold;
      });
    bloomFolder
      .add(bloomParams, 'bloomRadius', 0, 10)
      .step(0.01)
      .onChange(() => {
        bloomPass.radius = bloomParams.bloomRadius;
      });
  };

  const onFrame = () => {
    const currentTime = this.clock.getElapsedTime();

    for (let i = 0; i < tores.length; i++) {
      const amount =
        Math.sin(currentTime * vars.speed + i * vars.amountAngleScale) * vars.amountScale;
      tores[i].position.y = amount;
      const amountScaled = amount * vars.radiusScale;
      tores[i].scale.set(amountScaled, amountScaled, amountScaled);
      // tores[i].material.uniforms.time.value = currentTime;
      tores[i].material.color.setHSL(Math.sin(currentTime) * vars.hueRange + vars.startHue, 1, 0.5);
    }

    this.shouldRender = true;

    composer.render();
  };

  return {
    setup,
    onFrame,
    options: {
      showStats: true,
      useOrbit: false,
      disableAutoRender: true,
    },
  };
}

export default function (): Artwork<SketchThreeObject> {
  return {
    type: 'THREEJS',
    artworkFunction: idk,
  };
}
