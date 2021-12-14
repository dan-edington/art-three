import P5 from 'p5';
import { SketchThreeObject } from './sketchThree';

export type ArtworkType = 'THREEJS' | 'P5JS';

export type Artwork = {
  artworkFunction(): SketchThreeObject | ((p5: P5) => void);
  type: ArtworkType;
};
