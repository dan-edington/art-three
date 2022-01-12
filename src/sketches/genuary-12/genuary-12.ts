//@ts-nocheck
import * as THREE from 'three';
import * as dat from 'dat.gui';
import { SketchThreeObject, SketchThreeClass } from '../../types/sketchThree';
import { Artwork } from '../../types/artwork';

const randomBetween = (min: number, max: number) => Math.random() * (max - min) + min;

function artwork(this: SketchThreeClass): SketchThreeObject {
  let lights;
  const spheres = [];
  let sphereMesh;
  const meshDetail = 16;
  const area = 50;
  const shadowMapSize = 2048;
  const shadowNormalBias = 0.001;
  const shadowNear = 100;
  const shadowFar = 1000;
  const sphereCount = Math.floor(randomBetween(500, 1000));

  const gui = new dat.GUI();

  const vars = {
    bgColor: 0x191919,
    materialColor: 0xff0000,
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

  const sphereGeometry = new THREE.SphereGeometry(1, meshDetail, meshDetail);
  const sphereMaterial = new THREE.MeshPhysicalMaterial({
    transparent: true,
    color: vars.materialColor,
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
  }

  const createLights = () => {
    this.renderer.physicallyCorrectLights = true;
    this.renderer.toneMapping = THREE.CineonToneMapping;
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.shadowMap.enabled = true;
    // this.renderer.shadowMap.type = THREE.VSMShadowMap;

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
  };

  const setSpherePositions = () => {
    const dummy = new THREE.Object3D();

    const l = spheres.length;
    for (let i = 0; i < l; i++) {
      dummy.position.set(spheres[i].pos.x, spheres[i].pos.y, spheres[i].pos.z);
      dummy.scale.set(spheres[i].radius, spheres[i].radius, spheres[i].radius);
      dummy.updateMatrix();
      sphereMesh.setMatrixAt(i, dummy.matrix);
    }
    sphereMesh.instanceMatrix.needsUpdate = true;
  };

  const setupGUI = () => {
    gui.addColor(vars, 'bgColor').onChange(() => {
      this.renderer.setClearColor(vars.bgColor);
    });

    gui.addColor(vars, 'materialColor').onChange(() => {
      sphereMaterial.color = new THREE.Color(vars.materialColor);
    });

    const ambientFolder = gui.addFolder('Ambient');
    const point1Folder = gui.addFolder('Point 1');
    const point2Folder = gui.addFolder('Point 2');

    const area = 200;

    ambientFolder.addColor(vars.ambient, 'color').onChange(() => {
      lights.ambient.color = vars.ambient.color;
    });
    ambientFolder.add(vars.ambient, 'intensity', 0, 1000000).onChange(() => {
      lights.ambient.intensity = vars.ambient.intensity;
    });

    point1Folder.addColor(vars.point1, 'color').onChange(() => {
      lights.point1.color = vars.point1.color;
    });
    point1Folder.add(vars.point1, 'intensity', 0, 1000000).onChange(() => {
      lights.point1.intensity = vars.point1.intensity;
    });
    point1Folder.add(vars.point1, 'x', -area, area).onChange(() => {
      lights.point1.position.x = vars.point1.x;
    });
    point1Folder.add(vars.point1, 'y', -area, area).onChange(() => {
      lights.point1.position.y = vars.point1.y;
    });
    point1Folder.add(vars.point1, 'z', -area, area).onChange(() => {
      lights.point1.position.z = vars.point1.z;
    });

    point2Folder.addColor(vars.point2, 'color').onChange(() => {
      lights.point2.color = vars.point2.color;
    });
    point2Folder.add(vars.point2, 'intensity', 0, 1000000).onChange(() => {
      lights.point2.intensity = vars.point2.intensity;
    });
    point2Folder.add(vars.point2, 'x', -area, area).onChange(() => {
      lights.point2.position.x = vars.point2.x;
    });
    point2Folder.add(vars.point2, 'y', -area, area).onChange(() => {
      lights.point2.position.y = vars.point2.y;
    });
    point2Folder.add(vars.point2, 'z', -area, area).onChange(() => {
      lights.point2.position.z = vars.point2.z;
    });
  };

  const setup = () => {
    setupGUI();
    this.renderer.setClearColor(vars.bgColor);
    lights = createLights();
    generateSpheres();
    sphereMesh = new THREE.InstancedMesh(sphereGeometry, sphereMaterial, spheres.length);
    sphereMesh.castShadow = true;
    sphereMesh.receiveShadow = true;
    this.scene.add(sphereMesh, ...Object.values(lights));
    setSpherePositions();
    this.camera.position.z = area * 3;
  };

  const onFrame = () => {
    this.shouldRender = true;
    sphereMesh.rotation.y += 0.01;
  };

  return {
    setup,
    onFrame,
    options: {
      showStats: true,
      useOrbit: true,
    },
  };
}

export default function (): Artwork<SketchThreeObject> {
  return {
    type: 'THREEJS',
    artworkFunction: artwork,
  };
}
