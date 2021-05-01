import Sketch from "./Sketch";

export default function (this: Sketch) {

  this?.stats?.begin();
  
  this.onFrame();

  if (this.orbit) {
    this.orbit.update();
  }
  
  this.renderer.render(this.scene, this.camera);
  
  this?.stats?.end();
  
  requestAnimationFrame(() => {
    this.tick();
  });

}