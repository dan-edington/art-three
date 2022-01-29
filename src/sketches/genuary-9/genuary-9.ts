//@ts-nocheck
import * as THREE from 'three';
// import * as dat from 'dat.gui';

import {
  SketchThreeObject,
  SketchThreeClass,
  SketchThreeArtworkFunction,
} from '../../types/sketchThree';
import { Artwork } from '../../types/artwork';

function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}

function artwork(this: SketchThreeClass): SketchThreeObject {
  let lights;
  const wallThickness = 0.05;
  let city;
  // const gui = new dat.GUI();

  const buildingMaterial = new THREE.MeshStandardMaterial({ color: 0x363636 });
  const windowMaterial = new THREE.MeshStandardMaterial({ color: 0xf0f741 });

  const createLights = function () {
    return {
      ambient: new THREE.AmbientLight(0xffffff, 0.5),
      point: new THREE.PointLight(0xffffff, 1.0),
    };
  };

  const createRoof = (width, length, yPos) => {
    const roof = new THREE.Mesh(
      new THREE.BoxGeometry(width, wallThickness, length),
      buildingMaterial,
    );
    roof.receiveShadow = true;
    roof.position.y = yPos;
    return roof;
  };

  const createStandardWall = () => {
    const geometry = new THREE.BoxBufferGeometry(1, 1, wallThickness);
    const wall = new THREE.Mesh(geometry, buildingMaterial);
    wall.receiveShadow = true;
    return wall;
  };

  const createWindow = (height, count, windowWidth) => {
    const windowGroup = new THREE.Group();
    windowGroup.name = 'window';

    for (let i = 0; i < count; i++) {
      const windowBase = createStandardWall();
      const w = new THREE.BoxBufferGeometry(0.06, height, windowWidth);
      const windowMesh = new THREE.Mesh(w, windowMaterial);
      windowMesh.receiveShadow = true;
      windowMesh.rotation.y = Math.PI / 2;
      windowMesh.position.x = 1 / count / 2 + i * (1 / count) - 0.5;
      windowGroup.add(windowBase, windowMesh);
    }

    return windowGroup;
  };

  const createFloor = (width, length, height = 1, windowHeight, windowCount) => {
    const floorGroup = new THREE.Group();
    floorGroup.name = 'floor';
    const windowChance = 0.2;

    const floorPos = height * 0.5;

    for (let i = 0; i < width; i++) {
      let wall;
      if (Math.random() >= windowChance) {
        wall = createWindow(windowHeight, windowCount, getRandom(0.1, 1 / windowCount - 0.1));
      } else {
        wall = createStandardWall();
      }
      const wall2 = wall.clone();

      wall.position.set(i - width * 0.5 + 0.5, floorPos, length * 0.5);
      wall2.position.set(i - width * 0.5 + 0.5, floorPos, length * -0.5);

      floorGroup.add(wall, wall2);
    }

    for (let i = 0; i < length; i++) {
      let wall;
      if (Math.random() >= windowChance) {
        wall = createWindow(windowHeight, windowCount, getRandom(0.1, 1 / windowCount - 0.1));
      } else {
        wall = createStandardWall();
      }
      wall.rotation.y = Math.PI / 2;
      const wall2 = wall.clone();
      wall2.rotation.y = Math.PI / 2;

      wall.position.set(width * 0.5, floorPos, i - length * 0.5 + 0.5);
      wall2.position.set(width * -0.5, floorPos, i - length * 0.5 + 0.5);

      floorGroup.add(wall, wall2);
    }

    floorGroup.scale.y = height;
    floorGroup.position.y = 0;

    return floorGroup;
  };

  const createBuilding = (options) => {
    const buildingGroup = new THREE.Group();

    for (let i = 0; i < options.floorCount; i++) {
      const floor = createFloor(
        options.width,
        options.length,
        options.floorHeight,
        options.windowHeight,
        options.windowCount,
      );
      floor.position.y = i * options.floorHeight;
      buildingGroup.add(floor);
    }

    const roof = createRoof(
      options.width,
      options.length,
      options.floorHeight * options.floorCount,
    );
    buildingGroup.add(roof);

    buildingGroup.position.set(options.xPos, 0, options.zPos);
    return buildingGroup;
  };

  const createCity = () => {
    const cityGroup = new THREE.Group();
    cityGroup.name = 'city';

    for (let i = -5; i < 5; i++) {
      for (let j = -5; j < 5; j++) {
        const buildingOptions = {
          width: 1,
          length: 1,
          floorCount: Math.floor(getRandom(3, 12)),
          floorHeight: Math.floor(getRandom(1, 2)),
          windowHeight: getRandom(0.5, 0.9),
          windowCount: Math.floor(getRandom(2, 5)),
          xPos: i,
          zPos: j,
        };
        const b = createBuilding(buildingOptions);
        cityGroup.add(b);
      }
    }

    return cityGroup;
  };

  const setup = () => {
    this.renderer.shadowMap = true;
    this.renderer.setClearColor(0x000000);
    lights = createLights();
    lights.point.position.set(10, 10, 10);
    lights.point.castShadow = true;

    city = createCity();
    this.scene.add(city, ...Object.values(lights));

    this.camera.position.set(0, 15, -15);
    this.camera.lookAt(new THREE.Vector3(0, 5, 0));
  };

  const onFrame = () => {
    city.rotation.y += 0.01;
    this.shouldRender = true;
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
