import P5 from 'p5';

export type ArtworkType = 'THREEJS' | 'P5JS';

export type Artwork<T> = {
  type: ArtworkType;
  artworkFunction: (p5?: P5) => T;
};
