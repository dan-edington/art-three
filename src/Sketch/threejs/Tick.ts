import { SketchThreeClass } from '../../types/sketchThree';

export default function (this: SketchThreeClass): void {
  this?.stats?.begin();

  this.onFrame();

  if (this.shouldRender) {
    this.shouldRender = false;
    if (!this.options.disableAutoRender) {
      this.renderer.render(this.scene, this.camera);
    }
  }

  this?.stats?.end();

  if (!this.options.noAnimation) {
    requestAnimationFrame(this.tick);
  }
}
