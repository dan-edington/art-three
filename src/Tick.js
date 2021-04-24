export default function () {
  this.onFrame();
  this.orbit.update();
  this.renderer.render(this.scene, this.camera);
  requestAnimationFrame(this.tick);
}