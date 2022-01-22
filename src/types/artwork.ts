import P5 from 'p5';
import { SketchP5Object } from './sketchP5';
import { SketchThreeObject } from './sketchThree';

export type ArtworkType = 'THREEJS' | 'P5JS';

export interface Artwork {
  type: ArtworkType;
  artworkFunction(): SketchThreeObject;
  artworkFunction(p5: P5): SketchP5Object;
}
