//@ts-nocheck
import * as THREE from 'three';
// import * as CanvasCapture from 'canvas-capture';
import {
  SketchThreeObject,
  SketchThreeClass,
  SketchThreeArtworkFunction,
} from '../../types/sketchThree';
import { Artwork } from '../../types/artwork';

const randomBetween = (min: number, max: number) => Math.random() * (max - min) + min;

function artwork(this: SketchThreeClass): SketchThreeObject {
  let lights;
  const spheres = [];
  let nextAnimationIndex = 0;
  let sphereMesh;
  const meshDetail = 16;
  const area = 50;
  const shadowMapSize = 2048;
  const shadowNormalBias = 0.001;
  const shadowNear = 100;
  const shadowFar = 2000;
  let timer = 0;
  // let stopped = false;

  const sphereCount = Math.floor(randomBetween(500, 1000));

  const generateSphereColor = () => {
    const h = Math.floor(randomBetween(0, 360));
    const s = Math.floor(randomBetween(50, 100));
    const l = Math.floor(randomBetween(50, 100));
    return `hsl(${h}, ${s}%, ${l}%)`;
  };

  const generateBackgroundColor = () => {
    const h = Math.floor(randomBetween(0, 360));
    const s = 50;
    const l = 50;
    return `hsl(${h}, ${s}%, ${l}%)`;
  };

  const sphereGeometry = new THREE.SphereGeometry(1, meshDetail, meshDetail);
  const sphereMaterial = new THREE.MeshPhysicalMaterial({
    transparent: true,
    color: new THREE.Color(generateSphereColor()),
    metalness: 0.2,
    roughness: 0.2,
    transmission: 0.5,
    opacity: 1,
    ior: randomBetween(1.0, 2.333),
  });

  class Sphere {
    constructor(position) {
      this.pos = position;
      this.startPos = new THREE.Vector3(0, 0, 0);
      this.radius = 0.01;
      this.startRadius = 0.01;
      this.growing = true;
      this.animationProgress = 0;
    }

    grow() {
      while (this.growing) {
        this.radius += 0.01;
        this.sphereCollisions();
        this.edges();
      }
    }

    sphereCollisions() {
      const l = spheres.length;
      for (let i = 0; i < l; i++) {
        const distance = this.pos.distanceTo(spheres[i].pos);
        if (distance < this.radius + spheres[i].radius) {
          this.growing = false;
        }
      }
    }

    edges() {
      if (
        this.pos.x + this.radius > area ||
        this.pos.x - this.radius < -area ||
        this.pos.y + this.radius > area ||
        this.pos.y - this.radius < -area ||
        this.pos.z + this.radius > area ||
        this.pos.z - this.radius < -area
      ) {
        this.growing = false;
      }
    }

    updateAnimation(index) {
      const dummy = new THREE.Object3D();

      if (this.animationProgress >= 1) {
        return;
      }
      const newPos = this.pos.clone().multiplyScalar(this.animationProgress);

      dummy.position.set(newPos.x, newPos.y, newPos.z);
      dummy.scale.set(
        this.radius * this.animationProgress,
        this.radius * this.animationProgress,
        this.radius * this.animationProgress,
      );
      dummy.updateMatrix();
      sphereMesh.setMatrixAt(index, dummy.matrix);
      this.animationProgress += 0.01;
    }
  }

  const createLights = () => {
    const vars = {
      ambient: {
        color: 0xffffff,
        intensity: 0.5,
      },
      point1: {
        x: -200,
        y: 164,
        z: -200,
        color: 0xffffff,
        intensity: 100000,
      },
      point2: {
        x: 200,
        y: 106,
        z: 200,
        color: 0xffffff,
        intensity: 13682,
      },
    };

    const ambient = new THREE.AmbientLight(vars.ambient.color, vars.ambient.intensity);
    const point1 = new THREE.PointLight(vars.point1.color, vars.point1.intensity, 0, 2);
    const point2 = new THREE.PointLight(vars.point2.color, vars.point2.intensity, 0, 2);

    point1.position.set(vars.point1.x, vars.point1.y, vars.point1.z);
    point2.position.set(vars.point2.x, vars.point2.y, vars.point2.z);
    point1.castShadow = true;
    point2.castShadow = true;
    point1.shadow.mapSize.width = shadowMapSize;
    point1.shadow.mapSize.height = shadowMapSize;
    point2.shadow.mapSize.width = shadowMapSize;
    point2.shadow.mapSize.height = shadowMapSize;
    point1.shadow.normalBias = shadowNormalBias;
    point2.shadow.normalBias = shadowNormalBias;
    point1.shadow.camera.near = shadowNear;
    point1.shadow.camera.far = shadowFar;
    point2.shadow.camera.near = shadowNear;
    point2.shadow.camera.far = shadowFar;

    return {
      ambient,
      point1,
      point2,
    };
  };

  const generateSpheres = () => {
    for (let i = 0; i < sphereCount; i++) {
      let validPosition = false;
      let pos;

      while (!validPosition) {
        pos = new THREE.Vector3(
          Math.random() * (area * 2) - area,
          Math.random() * (area * 2) - area,
          Math.random() * (area * 2) - area,
        );

        if (spheres.length < 1) {
          validPosition = true;
        }

        const l = spheres.length;

        for (let i = 0; i < l; i++) {
          const distance = pos.distanceTo(spheres[i].pos);
          if (distance < this.radius + spheres[i].radius) {
            validPosition = false;
          } else {
            validPosition = true;
            break;
          }
        }
      }

      const sphere = new Sphere(pos);
      sphere.grow();
      spheres.push(sphere);
    }
    spheres.sort((a, b) => b.radius - a.radius);
  };

  const setupSphereMesh = () => {
    const dummy = new THREE.Object3D();
    sphereMesh = new THREE.InstancedMesh(sphereGeometry, sphereMaterial, spheres.length);
    sphereMesh.castShadow = true;
    sphereMesh.receiveShadow = true;
    const l = spheres.length;
    for (let i = 0; i < l; i++) {
      dummy.position.set(0, 0, 0);
      dummy.scale.set(0, 0, 0);
      dummy.updateMatrix();
      sphereMesh.setMatrixAt(i, dummy.matrix);
    }
    sphereMesh.instanceMatrix.needsUpdate = true;
  };

  const positionCamera = () => {
    this.camera.position.z = area * 2.5;
    this.camera.position.y = 75;
    this.camera.lookAt(0, 0, 0);
    this.camera.near = 1;
    this.camera.far = 10;
  };

  const setupRenderer = () => {
    this.renderer.physicallyCorrectLights = true;
    this.renderer.toneMapping = THREE.CineonToneMapping;
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.shadowMap.enabled = true;
    this.renderer.setClearColor(generateBackgroundColor());
  };

  const setup = () => {
    setupRenderer();
    lights = createLights();
    positionCamera();
    generateSpheres();
    setupSphereMesh();
    this.scene.add(sphereMesh, ...Object.values(lights));
    // CanvasCapture.init(this.renderer.domElement);
    // CanvasCapture.beginVideoRecord({ fps: 60, format: 'mp4', quality: 1.0 });
  };

  const onFrame = () => {
    this.shouldRender = true;
    sphereMesh.rotation.y += 0.01;
    const timeFloored = Math.floor(this.clock.getElapsedTime()) % 30;

    for (let i = 0; i < nextAnimationIndex; i++) {
      spheres[i].updateAnimation(i);
    }

    sphereMesh.instanceMatrix.needsUpdate = true;

    if (timer >= 2 && timeFloored >= 1 && nextAnimationIndex < spheres.length) {
      nextAnimationIndex++;
      timer = 0;
    }

    timer++;

    // if (!stopped) {
    //   CanvasCapture.recordFrame();
    // }

    // if (this.clock.getElapsedTime() >= 2 && !stopped) {
    //   stopped = true;
    //   CanvasCapture.stopRecord();
    // }
  };

  return {
    setup,
    onFrame,
    options: {
      showStats: false,
      useOrbit: false,
      dimensions: {
        width: 800,
        height: 800,
      },
    },
  };
}

export default function (): Artwork<SketchThreeArtworkFunction> {
  return {
    type: 'THREEJS',
    artworkFunction: artwork,
  };
}
