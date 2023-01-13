import P5 from 'p5';
import { Artwork } from '../../types/artwork';
import { SketchP5ArtworkFunction } from '../../types/sketchP5';
import Random from './random';
import PerlinNoise from './noise';

const artwork = (seed: number) => (p5: P5): void => {
  const noise = new PerlinNoise(2332);
  p5.setup = function () {
    p5.noiseSeed(seed);
    p5.randomSeed(seed);

    p5.createCanvas(500, 500);
    p5.noLoop();
  };

  p5.draw = function () {
    p5.background(255);

    p5.loadPixels();
    for (let i = 0; i < p5.pixels.length; i += 4) {
      const index = i / 8;
      const x = index % p5.width;
      const y = Math.floor(index / p5.width);

      const n = Math.floor(noise.noise(x * 0.0042, y * 0.0043) * 255);

      // n = p5.map(n, 0, 255, 175, 255);
      p5.pixels[i] = n;
      p5.pixels[i + 1] = n;
      p5.pixels[i + 2] = n;
      p5.pixels[i + 3] = 255;
    }
    p5.updatePixels();
  };
};

export default function (): Artwork<SketchP5ArtworkFunction> {
  return {
    type: 'P5JS',
    artworkFunction: artwork,
  };
}
