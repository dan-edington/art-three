import P5 from 'p5';

export interface SketchP5Class {
  DOMNode: HTMLElement;
  P5Instance: P5;
}

export type SketchP5ArtworkFunction = (seed: number) => (p5: P5) => void;
