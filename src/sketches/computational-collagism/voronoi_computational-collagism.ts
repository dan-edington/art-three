import P5 from 'p5';
import { Artwork } from '../../types/artwork';
import { SketchP5ArtworkFunction } from '../../types/sketchP5';

/*
SEEDS:
*/

const artwork = (seed: number) => (p5: P5): void => {
  const pallete = [
    p5.color('#459476'),
    p5.color('#2a4498'),
    p5.color('#000000'),
    p5.color('#dfdfdf'),
  ];

  const tintPallete = [pallete[0], pallete[1]];

  const imageCount = 13;
  const images: Array<P5.Image> = [];

  const size = 900;
  const minScale = 0.5;
  let pieces: number;
  let voronoi: Array<number>;
  let offsets: Array<P5.Vector>;
  let scales: Array<number>;

  const generateVoronoi = (): Array<number> => {
    const voronoi = [];
    const points = [];

    for (let i = 0; i < pieces; i++) {
      const vector = p5.createVector(p5.random(0, size), p5.random(0, size));
      points.push(vector);
    }

    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        const distances = points.map((point) => p5.dist(x, y, point.x, point.y));
        const minDistance = Math.min(...distances);
        const index = distances.indexOf(minDistance);
        voronoi.push(index);
      }
    }

    return voronoi;
  };

  const generateOffsets = () => {
    return voronoi.reduce((acc, curr, i) => {
      const x = i % size;
      const y = Math.floor(i / size);
      const offset = p5.createVector(x, y);
      if (acc[curr] instanceof P5.Vector) {
        if (offset.x < acc[curr].x) {
          acc[curr].x = offset.x;
        }
        if (offset.y < acc[curr].y) {
          acc[curr].y = offset.y;
        }
      } else {
        acc[curr] = offset;
      }
      return acc;
    }, new Array<P5.Vector>(pieces));
  };

  const generateScales = () => {
    return voronoi.map(() => p5.random(minScale, 1));
  };

  p5.preload = function () {
    for (let i = 1; i <= imageCount; i++) {
      const img = p5.loadImage(`./computational-collagism/${i}.jpeg`);
      images.push(img);
    }
  };

  p5.setup = function () {
    p5.randomSeed(seed);
    p5.createCanvas(size, size);
    p5.noLoop();
    pieces = Math.floor(p5.random(3, images.length));
    voronoi = generateVoronoi();
    offsets = generateOffsets();
    scales = generateScales();
  };

  p5.draw = function () {
    p5.background(0);

    // draw voronoi
    p5.noStroke();
    for (let i = 0; i < voronoi.length; i++) {
      const v = voronoi[i];
      const x = i % size;
      const y = Math.floor(i / size);
      const img = images[v];
      const wOff = img.width / 20;
      const hOff = img.height / 20;
      p5.image(
        img,
        x,
        y,
        1,
        1,
        (x - offsets[v].x + wOff) * scales[v],
        (y - offsets[v].y + hOff) * scales[v],
        1,
        1,
      );
    }
    p5.filter(p5.GRAY);
    p5.tint(Math.floor(p5.random(tintPallete.length)));
  };
};

export default function (): Artwork<SketchP5ArtworkFunction> {
  return {
    type: 'P5JS',
    artworkFunction: artwork,
  };
}
