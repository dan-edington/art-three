import P5 from 'p5';
import { Artwork } from '../../types/artwork';
import { SketchP5ArtworkFunction } from '../../types/sketchP5';

const artwork = (seed: number) => (p5: P5): void => {
  const dimensions = { w: 500, h: 1000 };

  const colors: Record<string, any> = {};

  const sizes = [20, 25, 50, 100, 125, 250, 500];
  let size: number;

  const squareFunctions = [
    (x: number, y: number, accent: boolean) => {
      //STRIPES
      let stripes = Math.round(p5.random(5, 11));
      if (stripes % 2 === 0) {
        stripes -= 1;
      }
      p5.push();
      if (p5.random() > 0.5) {
        p5.translate(x, y);
      } else {
        p5.translate(x + size, y);
        p5.angleMode(p5.DEGREES);
        p5.rotate(90);
      }
      const a = size / stripes;
      let count = 0;
      for (let i = 0; i < size; i += a) {
        if (count % 2 === 0) {
          p5.noStroke();
          p5.fill(accent ? colors.accent : colors.fill);
          p5.rect(0, i, size, a);
        }
        count++;
      }
      p5.pop();
    },
    (x: number, y: number, accent: boolean) => {
      //SQUARE
      p5.fill(accent ? colors.accent : colors.fill);
      p5.noStroke();
      const w = p5.random(size * 0.25, size * 0.75);
      const s = 0 + (size - w) / 2;
      p5.rect(s + x, s + y, w, w);
    },
    (x: number, y: number, accent: boolean) => {
      //NOISE
      const a = size / 10;
      const b = p5.random(0.01, 0.1);
      for (let i = 0; i < size; i += a) {
        for (let j = 0; j < size; j += a) {
          const newX = x + i;
          const newY = y + j;
          p5.noStroke();
          const n = p5.noise(newX * b, newY * b);
          p5.fill(n > 0.5 ? colors.bg : accent ? colors.accent : colors.fill);
          p5.rect(newX, newY, a, a);
        }
      }
    },
  ];

  const initColors = () => {
    const bgHue = p5.random() * 360;
    colors.fill = p5.color(p5.random() * 360, p5.random() * 40, p5.random() * 40);
    colors.bg = p5.color(bgHue, p5.random() * 100, 100);
    let accentHue = bgHue - p5.random(120, 230);
    if (accentHue < 0) {
      accentHue = 360 + accentHue;
    }
    colors.accent = p5.color(accentHue, 100, 100);
  };

  p5.setup = function () {
    p5.noiseSeed(seed);
    p5.randomSeed(seed);
    p5.colorMode(p5.HSB);
    p5.createCanvas(dimensions.w, dimensions.h);
    p5.noLoop();
    size = sizes[Math.floor(p5.random() * sizes.length)];
    initColors();
  };

  p5.draw = function () {
    p5.background(colors.bg);
    const accentChance = 0.65;

    for (let i = 0; i < dimensions.w; i += size) {
      for (let j = 0; j < dimensions.h; j += size) {
        if (p5.noise(i * 0.4, j * 0.4) > 0.6) {
          const accent = p5.noise(i * 0.05, j * 0.087) > accentChance ? true : false;
          squareFunctions[Math.floor(p5.noise(i, j) * squareFunctions.length)](i, j, accent);
        }
      }
    }
  };
};

export default function (): Artwork<SketchP5ArtworkFunction> {
  return {
    type: 'P5JS',
    artworkFunction: artwork,
  };
}
