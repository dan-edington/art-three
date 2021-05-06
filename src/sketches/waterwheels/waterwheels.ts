import * as CANNON from 'cannon-es';
import * as THREE from 'three';
import * as dat from 'dat.gui';
import { SketchObject, SketchClass } from '../../types/sketch';

export default function (this: SketchClass): SketchObject {
  let lights;
  let wheel: THREE.Group;
  const dummyMatrix = new THREE.Object3D();

  interface LightsObject {
    [key: string]: THREE.Light;
  }

  const addLights = (): LightsObject => {
    return {
      ambient: new THREE.AmbientLight(0xffffff, 0.25),
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

  const setup = (): void => {
    this.camera.position.z = 5;
    wheel = createWheel();
    wheel.position.set(0, 0, 0);
    lights = addLights();
    lights.point.position.set(-1, -1, 5);
    this.scene.add(wheel, ...Object.values(lights));
  };

  const renderInstancedBlades = () => {
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
      wheel.children[0].setMatrixAt(i, dummyMatrix.matrix);
    }
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
