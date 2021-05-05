import * as CANNON from 'cannon-es';
import * as THREE from 'three';
import * as dat from 'dat.gui';
import Sketch from '../../Sketch/Sketch';
import { SketchFunction } from '../../types/sketch';

export default function(this: Sketch): SketchFunction {

  let lights;

  const addLights = (): object => {
    return {
      ambient: new THREE.AmbientLight(0xffffff, 0.25),
      point: new THREE.PointLight(0xffffff, 1.0),
    }
  }

  const createWheel = () => {
    
    

  }

  const setup = (): void => {
    lights = addLights();
  }

  const onFrame = (): void => {

  }

  return {
    onFrame,
    setup,
  }
}