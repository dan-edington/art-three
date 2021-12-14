import * as THREE from 'three';
import * as dat from 'dat.gui';
import gsap from 'gsap';

import { SketchThreeObject, SketchThreeClass } from '../../types/sketchThree';
import { Artwork } from '../../types/artwork';

import logo from './deptLogo.png';
import imagePlaneFrag from './shaders/imagePlane.frag';
import imagePlaneVert from './shaders/imagePlane.vert';
import particlesFrag from './shaders/particles.frag';
import particlesVert from './shaders/particles.vert';

function deptLogo(this: SketchThreeClass): SketchThreeObject {
  let gui: dat.GUI;
  let lights;
  let imagePlane: THREE.Mesh<THREE.PlaneBufferGeometry, THREE.ShaderMaterial>;
  let particles: THREE.Points<THREE.PlaneBufferGeometry, THREE.ShaderMaterial>;
  let imageWidth: number;

  const vars = {
    progress: 0.0,
  };

  const pCountXY = 30;

  interface lightObject {
    [key: string]: THREE.Light;
  }

  const createLights = function (): lightObject {
    return {
      ambient: new THREE.AmbientLight(0xffffff, 0.25),
      point: new THREE.PointLight(0xffffff, 1.0),
    };
  };

  const createImagePlane = function (): Promise<
    THREE.Mesh<THREE.PlaneBufferGeometry, THREE.ShaderMaterial>
  > {
    return new Promise<THREE.Mesh<THREE.PlaneBufferGeometry, THREE.ShaderMaterial>>(
      (resolve, reject) => {
        new THREE.TextureLoader().load(logo, (texture) => {
          imageWidth = texture.image.width / texture.image.height;
          const plane = new THREE.PlaneBufferGeometry(imageWidth, 1, 1, 1);

          const planeMaterial = new THREE.ShaderMaterial({
            uniforms: {
              uTexture: { value: texture },
              uProgress: { value: vars.progress },
            },
            vertexShader: imagePlaneVert,
            fragmentShader: imagePlaneFrag,
            transparent: true,
          });

          resolve(new THREE.Mesh(plane, planeMaterial));
        });
      },
    );
  };

  const createParticles = function (): THREE.Points<
    THREE.PlaneBufferGeometry,
    THREE.ShaderMaterial
  > {
    const plane = new THREE.PlaneBufferGeometry(0.1, 1, pCountXY, pCountXY);
    const particlesMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uProgress: { value: vars.progress },
        uImageWidth: { value: imageWidth },
      },
      vertexShader: particlesVert,
      fragmentShader: particlesFrag,
      transparent: true,
      depthWrite: false,
      depthTest: false,
    });
    const particles = new THREE.Points(plane, particlesMaterial);
    particles.position.x = imageWidth * -0.5;
    return particles;
  };

  const updateUniforms = (): void => {
    imagePlane.material.uniforms.uProgress.value = vars.progress;
    particles.material.uniforms.uProgress.value = vars.progress;
    this.shouldRender = true;
  };

  const setupGUI = (): void => {
    gui = new dat.GUI();
    gui.add(vars, 'progress', 0.0, 1.0, 0.01).onChange(updateUniforms);
  };

  const startAnimation = (): void => {
    gsap.to(vars, {
      duration: 10,
      progress: 1.0,
      ease: 'power2.out',
      onUpdate: updateUniforms,
    });
  };

  const setup = async (): Promise<void> => {
    this.renderer.setClearColor(0x000000);
    imagePlane = await createImagePlane();
    particles = createParticles();
    lights = createLights();
    lights.point.position.set(2, 2, 2);
    this.scene.add(imagePlane, particles, ...Object.values(lights));
    //setupGUI();
    window.addEventListener('click', startAnimation);
  };

  const onFrame = (): void => {
    //
  };

  return {
    setup,
    onFrame,
    options: {
      useOrbit: false,
      showStats: true,
    },
  };
}

export default function (): Artwork<SketchThreeObject> {
  return {
    type: 'THREEJS',
    artworkFunction: deptLogo,
  };
}
