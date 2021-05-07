import * as CANNON from 'cannon-es';
import * as THREE from 'three';
import * as dat from 'dat.gui';
import { SketchObject, SketchClass } from '../../types/sketch';

interface LightsObject {
  [key: string]: THREE.Light;
}

interface Wheels {
  group: THREE.Group;
  xyPos: THREE.Vector2;
}

export default function (this: SketchClass): SketchObject {
  let lights: LightsObject;
  let wheels: Wheels[];
  const wheelCount = 5;
  const dummyMatrix = new THREE.Object3D();
  const world = new CANNON.World({
    gravity: new CANNON.Vec3(0, -9.82, 0), // m/s²
  });

  const addLights = (): LightsObject => {
    return {
      ambient: new THREE.AmbientLight(0xffffff, 0.5),
      point: new THREE.PointLight(0xffffff, 1.0),
    };
  };

  const createWheel = (): THREE.Group => {
    const wheel = new THREE.Group();

    const material = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });

    const center = new THREE.Mesh(
      new THREE.CylinderBufferGeometry(1, 1, 0.5, 8, 1, false),
      material,
    );

    const centerShape = new CANNON.Cylinder(1, 1, 0.5, 8);
    const centerBody = new CANNON.Body({ mass: 1, shape: centerShape });

    const blade = new THREE.InstancedMesh(
      new THREE.BoxBufferGeometry(0.1, 0.5, 1, 1, 1, 1),
      material,
      8,
    );

    blade.rotation.x = Math.PI * 0.5;
    center.rotation.x = Math.PI * 0.5;
    wheel.add(blade);
    wheel.add(center);

    return wheel;
  };

  const createWall = () => {
    const material = new THREE.MeshStandardMaterial({ color: 0x0000ff });
    const wall = new THREE.Mesh(new THREE.BoxBufferGeometry(10, 10, 1, 1, 1, 1), material);
    return wall;
  };

  const createRandomWheels = (): Wheels[] => {
    const wheels = [];
    for (let i = 0; i < wheelCount; i++) {
      const wheel = createWheel();
      const xyPos = new THREE.Vector2(Math.random() * 10 - 5, i * 2 - (wheelCount - 1));
      wheel.scale.set(0.25, 0.25, 0.25);
      wheel.position.set(xyPos.x, xyPos.y, 0);
      wheels.push({
        group: wheel,
        xyPos,
      });
    }
    return wheels;
  };

  const setup = (): void => {
    // override default camera
    this.camera = new THREE.OrthographicCamera(-5, 5, -5, 5, 1, 200);
    this.camera.position.set(0, 0, 1);

    lights = addLights();
    lights.point.position.set(0, 0, 10);

    const wall = createWall();
    wall.position.z = -0.5;

    wheels = createRandomWheels();
    wheels.forEach((w) => {
      this.scene.add(w.group);
    });

    this.scene.add(wall, ...Object.values(lights));
  };

  const renderInstancedBlades = () => {
    wheels.forEach((w) => {
      for (let i = 0; i < 8; i++) {
        const ii = i + Math.PI * 0.8;
        const radius = 1.4;
        const step = (Math.PI * 2) / 8;
        const x = radius * Math.sin(step * ii);
        const y = radius * Math.cos(step * ii);
        dummyMatrix.position.set(x, 0, y);
        dummyMatrix.rotation.y = step * ii;
        dummyMatrix.updateMatrix();
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        w.group.children[0].setMatrixAt(i, dummyMatrix.matrix);
      }
    });
  };

  const onFrame = (): void => {
    renderInstancedBlades();
    this.shouldRender = true;
  };

  return {
    onFrame,
    setup,
  };
}
