export default function (this: Sketch) {
  this.onFrame();
  if (this.orbit) {
    this.orbit.update();
  }
  this.renderer.render(this.scene, this.camera);
  requestAnimationFrame(() => {
    this.tick();
  })
}