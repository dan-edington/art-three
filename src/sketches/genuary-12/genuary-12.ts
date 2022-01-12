//@ts-nocheck
import * as THREE from 'three';
import * as dat from 'dat.gui';
import { SketchThreeObject, SketchThreeClass } from '../../types/sketchThree';
import { Artwork } from '../../types/artwork';

function artwork(this: SketchThreeClass): SketchThreeObject {
  let lights;
  const spheres = [];
  let sphereMesh;
  const meshDetail = 16;
  const area = 50;
  const sphereCount = Math.floor(Math.random() * 1000);
  const sphereGeometry = new THREE.SphereGeometry(1, meshDetail, meshDetail);
  const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
  const gui = new dat.GUI();

  const vars = {
    bgColor: 0x191919,
    ambient: {
      color: 0xffffff,
      intensity: 0.2,
    },
    point1: {
      x: -200,
      y: 164,
      z: -200,
      color: 0xffffff,
      intensity: 1,
    },
    point2: {
      x: 200,
      y: 106,
      z: 200,
      color: 0xffffff,
      intensity: 1,
    },
  };

  class Sphere {
    constructor(position) {
      this.pos = position;
      this.startPos = new THREE.Vector3(0, 0, 0);
      this.radius = 0.01;
      this.startRadius = 0.01;
      this.growing = true;
      this.progress = 0;
      this.animRate = Math.random() * 0.001 + 0.001;
    }

    update() {
      if (this.progress < 1) {
        this.progress += this.animRate;
      }
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

  const createLights = function () {
    return {
      ambient: new THREE.AmbientLight(vars.ambient.color, vars.ambient.intensity),
      point1: new THREE.PointLight(vars.point1.color, vars.point1.intensity),
      point2: new THREE.PointLight(vars.point2.color, vars.point2.intensity),
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
    const ambientFolder = gui.addFolder('Ambient');
    const point1Folder = gui.addFolder('Point 1');
    const point2Folder = gui.addFolder('Point 2');

    const area = 200;

    ambientFolder.addColor(vars.ambient, 'color').onChange(() => {
      console.log(lights.ambient.color);
      console.log(vars.ambient.color);
      lights.ambient.color = vars.ambient.color;
    });
    ambientFolder.add(vars.ambient, 'intensity', 0, 1).onChange(() => {
      lights.ambient.intensity = vars.ambient.intensity;
    });

    point1Folder.addColor(vars.point1, 'color').onChange(() => {
      lights.point1.color = vars.point1.color;
    });
    point1Folder.add(vars.point1, 'intensity', 0, 1).onChange(() => {
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
    point2Folder.add(vars.point2, 'intensity', 0, 1).onChange(() => {
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
    generateSpheres();
    lights = createLights();
    lights.point1.position.set(vars.point1.x, vars.point1.y, vars.point1.z);
    lights.point2.position.set(vars.point2.x, vars.point2.y, vars.point2.z);
    this.camera.position.z = area * 3;
    sphereMesh = new THREE.InstancedMesh(sphereGeometry, sphereMaterial, spheres.length);
    this.scene.add(sphereMesh, ...Object.values(lights));
    setSpherePositions();
  };

  const animateSpheres = () => {
    const dummy = new THREE.Object3D();

    const l = spheres.length;
    for (let i = 0; i < l; i++) {
      const amount = spheres[i].progress;
      const scaledPos = spheres[i].pos.clone().multiplyScalar(amount);
      const scaledScale = spheres[i].radius * amount;
      dummy.position.set(scaledPos.x, scaledPos.y, scaledPos.z);
      dummy.scale.set(scaledScale, scaledScale, scaledScale);
      dummy.updateMatrix();
      sphereMesh.setMatrixAt(i, dummy.matrix);
      spheres[i].update();
    }
    sphereMesh.instanceMatrix.needsUpdate = true;
  };

  const onFrame = () => {
    // animateSpheres();
    this.shouldRender = true;
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
