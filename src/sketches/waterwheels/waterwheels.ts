// @ts-nocheck

import * as CANNON from 'cannon-es';
import * as THREE from 'three';
import * as dat from 'dat.gui';
import { SketchObject, SketchClass } from '../../types/sketch';

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

export default function (this: SketchClass): SketchObject {
  let lights: LightsObject;
  let wheels: Wheel[];
  let balls: Ball[];
  let wall;
  const wheelCount = 5;
  const wheelSides = 8;

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

  const getBladeTransform = (i: number) => {
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
    const wheelBody = new CANNON.Body({ mass: 1 });

    // center

    const center = new THREE.Mesh(
      new THREE.CylinderBufferGeometry(1 * scale, 1 * scale, 0.5 * scale, wheelSides, 1, false),
      material,
    );
    center.castShadow = true;
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
      const { x, y, rotationY } = getBladeTransform(i);
      const blade = new THREE.Mesh(bladeGeometry, material);
      blade.position.set(x * scale, 0, y * scale);
      blade.rotation.y = rotationY;
      blade.castShadow = true;
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

  const createWall = () => {
    const material = new THREE.MeshStandardMaterial({ color: 0x0000ff });
    const wall = new THREE.Mesh(new THREE.BoxBufferGeometry(10, 10, 1, 1, 1, 1), material);
    const wallBody = new CANNON.Body({ mass: 0 });
    wallBody.addShape(new CANNON.Box(new CANNON.Vec3(5, 5, 0.5)));

    wall.receiveShadow = true;

    this.scene.add(wall);

    return {
      wall,
      wallBody,
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

    const balls = [];

    for (let i = 0; i < 5; i++) {
      const ball = new THREE.Mesh(new THREE.SphereBufferGeometry(radius, 8, 8), material);
      ball.castShadow = true;
      const ballBody = new CANNON.Body({ mass: 0.1 });
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
    wheels.forEach((w) => {
      const wheelBody = w.wheelBody;
      const wallBody = wall.wallBody;
      const pivotA = w.wheelBody.position;
      pivotA.z = 0.55;
      const constraint = new CANNON.HingeConstraint(wallBody, wheelBody, {
        pivotA,
        axisA: new CANNON.Vec3(0, 0, 1),
        pivotB: zero,
        axisB: new CANNON.Vec3(0, 1, 0),
      });
      world.addConstraint(constraint);
    });
  };

  const setup = (): void => {
    // override default camera
    //this.camera = new THREE.OrthographicCamera(-5, 5, -5, 5, 1, 200);
    this.camera.position.set(0, 0, 10);

    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;

    wall = createWall();
    wall.wall.position.z = -0.55;
    syncPhysicsToObject(wall, 'wall', 'wallBody');

    lights = addLights();
    lights.directional.castShadow = true;
    lights.directional.position.set(0, 0, 10);
    lights.directional.lookAt(wall.wall.position);

    balls = createBalls();
    balls.forEach((b) => {
      b.ball.position.y = 5;
      b.ball.position.x = Math.random() * 10 - 5;
      // @ts-ignore
      b.ballBody.position.copy(b.ball.position);
      this.scene.add(b.ball);
      world.addBody(b.ballBody);
    });

    wheels = createRandomWheels();
    wheels.forEach((w) => {
      this.scene.add(w.wheel);
      world.addBody(w.wheelBody);
    });

    connectWheelsToWall();
  };

  const timeStep = 1 / 60;
  let lastCallTime: number;

  const onFrame = (): void => {
    const time = performance.now() / 1000; // seconds
    if (!lastCallTime) {
      world.step(timeStep);
    } else {
      const dt = time - lastCallTime;
      world.step(timeStep, dt);
    }
    lastCallTime = time;
    wheels.forEach((w) => {
      syncObjectToPhysics(w, 'wheel', 'wheelBody');
    });
    balls.forEach((b) => {
      syncObjectToPhysics(b, 'ball', 'ballBody');
      if (b.ball.position.y < -5) {
        b.ballBody.position.set(Math.random() * 10 - 5, 5, 0);
        b.ballBody.velocity.set(0, 0, 0);
        b.ballBody.angularVelocity.set(0, 0, 0);
      }
    });
    this.shouldRender = true;
  };

  return {
    onFrame,
    setup,
  };
}
