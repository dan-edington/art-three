import { SketchThreeObject } from './sketchThree';
import { SketchP5Object } from './sketchP5';

export type ArtworkType = 'THREEJS' | 'P5JS';

export type Artwork = {
  artworkFunction(): SketchThreeObject | SketchP5Object;
  type: ArtworkType;
};
