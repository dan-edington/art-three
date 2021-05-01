import * as THREE from 'three';
import * as dat from 'dat.gui';
import gsap from 'gsap';

import logo from './deptLogo.png';
import imagePlaneFrag from './shaders/imagePlane.frag';
import imagePlaneVert from './shaders/imagePlane.vert';
import particlesFrag from './shaders/particles.frag';
import particlesVert from './shaders/particles.vert';
import Sketch from '../../Sketch/Sketch';

export default function (this: Sketch): SketchFunction {
  let gui
  let lights;
  let imagePlane: THREE.Mesh<THREE.PlaneBufferGeometry, THREE.ShaderMaterial>;
  let particles: THREE.Points<THREE.PlaneBufferGeometry, THREE.ShaderMaterial>;
  let imageWidth: number;
  
  const vars = {
      progress: 0.0,
  };

  const pCountXY = 30;
  
  const createLights = function () {
    return {
        ambient: new THREE.AmbientLight(0xffffff, 0.25),
        point: new THREE.PointLight(0xffffff, 1.0),
    }
  }

  const createImagePlane = function () {
    return new Promise<THREE.Mesh<THREE.PlaneBufferGeometry, THREE.ShaderMaterial>>((resolve, reject) => {

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

    })
  }

  const createParticles = function () {
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
  }

  const updateUniforms = () => {
    imagePlane.material.uniforms.uProgress.value = vars.progress;
    particles.material.uniforms.uProgress.value = vars.progress;
  }

  const setupGUI = () => {
    gui = new dat.GUI();
    gui.add(vars, 'progress', 0.0, 1.0, 0.01).onChange(updateUniforms);
  }

  const startAnimation = () => {
    gsap.to(vars, { duration: 10, progress: 1.0, ease: 'power2.out', onUpdate: updateUniforms });
  }

  const setup = async () => {
    this.renderer.setClearColor(0x000000);
    imagePlane = await createImagePlane();
    particles = createParticles();
    lights = createLights();
    lights.point.position.set(2, 2, 2);
    this.scene.add(imagePlane, particles, ...Object.values(lights));
    //setupGUI();
    window.addEventListener('click', startAnimation);
  };

  const onFrame = () => {};

  return {
    setup,
    onFrame,
    options: {
      useOrbit: false,
      showStats: true,
    }
  }
}