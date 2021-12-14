import P5 from 'p5';
import { SketchP5Class } from '../../types/sketchP5';

class SketchP5 implements SketchP5Class {
  DOMNode: HTMLElement;
  P5Instance: P5;

  constructor(sketchFn: () => void) {
    this.DOMNode = this.generateDOM();
    this.P5Instance = new P5(sketchFn, this.DOMNode);
  }

  generateDOM(): HTMLElement {
    const sketchP5Container = document.createElement('div');
    sketchP5Container.setAttribute('id', 'sketch');
    document.body.appendChild(sketchP5Container);
    return sketchP5Container;
  }
}

export default SketchP5;
