import P5 from 'p5';
import { SketchP5Class, SketchP5ArtworkFunction } from '../../types/sketchP5';

class SketchP5 implements SketchP5Class {
  DOMNode: HTMLElement;
  P5Instance: P5;

  constructor(sketchFn: SketchP5ArtworkFunction, seed: number) {
    this.DOMNode = this.generateDOM();
    const seededFunction = sketchFn(seed);
    this.P5Instance = new P5(seededFunction, this.DOMNode);
  }

  generateDOM(): HTMLElement {
    const sketchP5Container = document.createElement('div');
    sketchP5Container.setAttribute('id', 'p5Sketch');
    document.body.appendChild(sketchP5Container);
    return sketchP5Container;
  }
}

export default SketchP5;
