// @ts-nocheck

import * as CANNON from 'cannon-es';
import * as THREE from 'three';

import {
  SketchThreeObject,
  SketchThreeClass,
  SketchThreeArtworkFunction,
} from '../../types/sketchThree';
import { Artwork } from '../../types/artwork';

interface Wheel {
  wheel: THREE.Group;
  wheelBody: CANNON.Body;
}
interface Ball {
  ball: THREE.Mesh;
  ballBody: CANNON.Body;
}
interface LightsObject {
  [key: string]: THREE.Light;
}

function waterwheels(this: SketchThreeClass): SketchThreeObject {
  let lights: LightsObject;
  let wheels: Wheel[];
  let balls: Ball[];
  let wall;

  const wheelCount = 5;
  const ballCount = 20;
  const wheelSides = 3;

  const timeStep = 1 / 60;
  let lastCallTime: number;

  const world = new CANNON.World({
    gravity: new CANNON.Vec3(0, -9.82, 0), // m/s²
  });

  const syncObjectToPhysics = (obj, obj3d: string, body: string) => {
    obj[obj3d].position.copy(obj[body].position);
    obj[obj3d].quaternion.copy(obj[body].quaternion);
  };

  const syncPhysicsToObject = (obj, obj3d: string, body: string) => {
    obj[body].position.copy(obj[obj3d].position);
    obj[body].quaternion.copy(obj[obj3d].quaternion);
  };

  const addLights = (): LightsObject => {
    const lights = {
      //ambient: new THREE.AmbientLight(0xffffff, 0.5),
      directional: new THREE.DirectionalLight(0xffffff, 1),
      //point: new THREE.PointLight(0xffffff, 1),
    };

    this.scene.add(...Object.values(lights));

    return lights;
  };

  const createWall = () => {
    const material = new THREE.MeshStandardMaterial({ color: 0x0000ff });
    const wall = new THREE.Mesh(new THREE.BoxBufferGeometry(10, 10, 1, 1, 1, 1), material);
    const wallBody = new CANNON.Body({ mass: 0 });
    const wallBodyMaterial = new CANNON.Material('wallBody');
    wallBodyMaterial.friction = 0.1;
    wallBody.material = wallBodyMaterial;
    wallBody.addShape(new CANNON.Box(new CANNON.Vec3(5, 5, 0.5)));

    this.scene.add(wall);

    return {
      wall,
      wallBody,
    };
  };

  const calculateBladeTransform = (i: number) => {
    const ii = i + Math.PI * 0.8;
    const radius = 1.4;
    const step = (Math.PI * 2) / wheelSides;
    const x = radius * Math.sin(step * ii);
    const y = radius * Math.cos(step * ii);
    const rotationY = step * ii;
    return {
      x,
      y,
      rotationY,
    };
  };

  const createWheel = (position: THREE.Vector2, scale: number): Wheel => {
    const wheel = new THREE.Group();
    const material = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
    const wheelBody = new CANNON.Body({ mass: 2 });
    const wheelBodyMaterial = new CANNON.Material('wheelBody');
    wheelBodyMaterial.friction = 0.1;
    wheelBody.material = wheelBodyMaterial;

    // center

    const center = new THREE.Mesh(
      new THREE.CylinderBufferGeometry(1 * scale, 1 * scale, 0.5 * scale, wheelSides, 1, false),
      material,
    );
    wheel.add(center);

    const centerShape = new CANNON.Cylinder(1 * scale, 1 * scale, 0.5 * scale, wheelSides);
    wheelBody.addShape(
      centerShape,
      new CANNON.Vec3(0, 0, 0),
      // @ts-ignore
      new CANNON.Quaternion().copy(center.quaternion),
    );

    // blades

    const bladeGeometry = new THREE.BoxBufferGeometry(0.1 * scale, 0.5 * scale, 1 * scale, 1, 1, 1);

    for (let i = 0; i < wheelSides; i++) {
      const { x, y, rotationY } = calculateBladeTransform(i);
      const blade = new THREE.Mesh(bladeGeometry, material);
      blade.position.set(x * scale, 0, y * scale);
      blade.rotation.y = rotationY;

      wheel.add(blade);

      const bladeShape = new CANNON.Box(new CANNON.Vec3(0.1 * scale, 0.5 * scale, 1 * scale));
      wheelBody.addShape(
        bladeShape,
        // @ts-ignore
        new CANNON.Vec3(0, 0, 0).copy(blade.position),
        // @ts-ignore
        new CANNON.Quaternion().copy(blade.quaternion),
      );
    }

    wheel.rotation.x = Math.PI * 0.5;
    wheel.position.set(position.x, position.y, 0);
    // @ts-ignore
    wheelBody.quaternion.copy(wheel.quaternion);
    // @ts-ignore
    wheelBody.position.copy(wheel.position);

    return {
      wheel,
      wheelBody,
    };
  };

  const createRandomWheels = () => {
    const wheels = [];

    for (let i = 0; i < wheelCount; i++) {
      const xyPos = new THREE.Vector2(Math.random() * 10 - 5, i * 2 - (wheelCount - 1));
      const scale = Math.random() * (0.5 - 0.25) + 0.25;
      const wheel = createWheel(xyPos, scale);
      wheels.push(wheel);
    }

    return wheels;
  };

  const createBalls = (): Ball[] => {
    const radius = 0.05;
    const material = new THREE.MeshStandardMaterial({ color: 0x00ffff });
    const ballShape = new CANNON.Sphere(radius);
    const bodyMaterial = new CANNON.Material('body');
    bodyMaterial.friction = 10000000;
    bodyMaterial.restitution = 0.1;

    const balls = [];

    for (let i = 0; i < ballCount; i++) {
      const ball = new THREE.Mesh(new THREE.SphereBufferGeometry(radius, 4, 4), material);

      const ballBody = new CANNON.Body({ mass: 0.1 });
      ballBody.material = bodyMaterial;
      ballBody.addShape(ballShape);
      balls.push({
        ball,
        ballBody,
      });
    }

    return balls;
  };

  const connectWheelsToWall = () => {
    const zero = new CANNON.Vec3();
    const axisA = new CANNON.Vec3(0, 0, 1);
    const axisB = new CANNON.Vec3(0, 1, 0);

    for (let i = 0; i < wheels.length; i++) {
      const wheelBody = wheels[i].wheelBody;
      const pivotA = wheelBody.position;
      pivotA.z = 0.55;
      const constraint = new CANNON.HingeConstraint(wall.wallBody, wheelBody, {
        pivotA: wheelBody.position,
        axisA,
        pivotB: zero,
        axisB,
      });
      world.addConstraint(constraint);
    }
  };

  const setupCamera = (): void => {
    //this.camera = new THREE.OrthographicCamera(-5, 5, -5, 5, 1, 200);
    this.camera.position.set(0, 0, 10);
  };

  const setup = (): void => {
    setupCamera();

    wall = createWall();
    wall.wall.position.z = -0.55;
    syncPhysicsToObject(wall, 'wall', 'wallBody');

    lights = addLights();
    lights.directional.position.set(0, 0, 10);
    lights.directional.lookAt(wall.wall.position);

    balls = createBalls();

    for (let i = 0; i < balls.length; i++) {
      balls[i].ball.position.set(5, Math.random() * 10 - 5, 0);
      balls[i].ballBody.position.copy(balls[i].ball.position);
      this.scene.add(balls[i].ball);
      world.addBody(balls[i].ballBody);
    }

    wheels = createRandomWheels();

    for (let i = 0; i < wheels.length; i++) {
      this.scene.add(wheels[i].wheel);
      world.addBody(wheels[i].wheelBody);
    }

    connectWheelsToWall();
  };

  const onFrame = (): void => {
    const time = performance.now() / 1000;

    if (!lastCallTime) {
      world.step(timeStep);
    } else {
      const dt = time - lastCallTime;
      world.step(timeStep, dt);
    }

    lastCallTime = time;

    for (let i = 0; i < wheels.length; i++) {
      syncObjectToPhysics(wheels[i], 'wheel', 'wheelBody');
    }

    for (let i = 0; i < balls.length; i++) {
      syncObjectToPhysics(balls[i], 'ball', 'ballBody');
      if (balls[i].ball.position.y < -5) {
        balls[i].ballBody.position.set(Math.random() * 10 - 5, 5, 0);
        balls[i].ballBody.velocity.set(0, 0, 0);
        balls[i].ballBody.angularVelocity.set(0, 0, 0);
      }
    }

    this.shouldRender = true;
  };

  return {
    onFrame,
    setup,
  };
}

export default function (): Artwork<SketchThreeArtworkFunction> {
  return {
    type: 'THREEJS',
    artworkFunction: waterwheels,
  };
}
