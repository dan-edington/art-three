import * as CANNON from 'cannon-es';
import * as THREE from 'three';
import * as dat from 'dat.gui';
import { SketchObject, SketchClass } from '../../types/sketch';

export default function (this: SketchClass): SketchObject {
  let lights;

  interface LightsObject {
    [key: string]: THREE.Light;
  }

  const addLights = (): LightsObject => {
    return {
      ambient: new THREE.AmbientLight(0xffffff, 0.25),
      point: new THREE.PointLight(0xffffff, 1.0),
    };
  };

  const createWheel = () => {
    //
  };

  const setup = (): void => {
    lights = addLights();
  };

  const onFrame = (): void => {
    //
  };

  return {
    onFrame,
    setup,
  };
}
