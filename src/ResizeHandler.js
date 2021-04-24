export default function() {
  this.camera.aspect = window.innerWidth / window.innerHeight
  this.camera.updateProjectionMatrix();
  this.renderer.setSize(window.innerWidth, window.innerHeight);
  this.renderer.setPixelRatio(window.devicePixelRatio);
}