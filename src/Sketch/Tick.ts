import { SketchClass } from '../types/sketch';

export default function (this: SketchClass): void {
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
