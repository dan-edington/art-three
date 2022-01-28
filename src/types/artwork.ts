export type ArtworkType = 'THREEJS' | 'P5JS';

export interface Artwork<T> {
  type: ArtworkType;
  artworkFunction: T;
}
