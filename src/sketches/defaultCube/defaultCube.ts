import * as THREE from 'three';
import * as dat from 'dat.gui';

export default function (this: SketchClass): SketchFunction {
  let cube: THREE.Mesh;
  let lights;

  const gui = new dat.GUI();

  const vars = {
      rotation: 0,
  };

  const createCube = function () {
      const geometry = new THREE.BoxGeometry();
      const material = new THREE.MeshStandardMaterial( { color: 'hotpink' } );
      return new THREE.Mesh(geometry, material);  
  }
  
  const createLights = function () {
      return {
          ambient: new THREE.AmbientLight(0xffffff, 0.25),
          point: new THREE.PointLight(0xffffff, 1.0),
      }
  }

  const setup = () => {
      gui.add(vars, 'rotation', 0, Math.PI * 2, 0.001);
      lights = createLights();
      lights.point.position.set(2, 2, 2);
      cube = createCube();
      this.scene.add(cube, ...Object.values(lights));
  };

  const onFrame = () => {
      cube.rotation.y = vars.rotation;
  };

  return {
      setup,
      onFrame,
  }
}