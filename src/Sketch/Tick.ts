export default function (this: SketchClass) {
  this.onFrame();
  if (this.orbit) {
    this.orbit.update();
  }
  this.renderer.render(this.scene, this.camera);
  requestAnimationFrame(() => {
    this.tick();
  })
}