import P5 from 'p5';
import { Artwork } from '../../types/artwork';
import { SketchP5ArtworkFunction } from '../../types/sketchP5';

const artwork = (seed: number) => (p5: P5): void => {
  const dimensions = { w: 500, h: 1000 };

  const colors: Record<string, any> = {};

  const directions = [];

  const generateSize = () => {
    const limit = 10000;
    let count = 0;
    let found = false;
    let answer = 100;
    while (!found) {
      const r = Math.round(p5.random(1, 5));
      if (r % 5 === 0) {
        answer = r * 100;
        found = true;
      }
      count++;
      if (count > limit) {
        break;
      }
    }
    console.log(answer);
    return answer;
  };

  const size = Math.round(p5.random(1, 100)) * 5;

  const squareFunctions = [
    (x: number, y: number) => {
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
          p5.fill(colors.fill);
          p5.rect(0, i, size, a);
        }
        count++;
      }
      p5.pop();
    },
    // (x: number, y: number) => {
    //   const w = 11;
    //   const middleX = x + size * 0.5;
    //   const middleY = y + size * 0.5;
    //   p5.strokeWeight(w);
    //   if (p5.random() > 0.5) {
    //     p5.noFill();
    //   } else {
    //     p5.fill(colors.fill);
    //   }
    //   p5.stroke(colors.fill);
    //   p5.circle(middleX, middleY, p5.random(50, size - w));
    // },
    (x: number, y: number) => {
      p5.fill(colors.fill);

      p5.stroke(colors.bg);
      const w = p5.random(10, 30);
      p5.strokeWeight(w);

      p5.rect(x + w, y + w, size - w * 2, size - w * 2);
    },
    (x: number, y: number) => {
      const a = size / 10;
      const b = p5.random(0.01, 0.1);
      for (let i = 0; i < size; i += a) {
        for (let j = 0; j < size; j += a) {
          const newX = x + i;
          const newY = y + j;
          p5.noStroke();
          const n = p5.noise(newX * b, newY * b);
          p5.fill(n > 0.5 ? colors.bg : colors.fill);
          p5.rect(newX, newY, a, a);
        }
      }
    },
    (x: number, y: number) => {
      return false;
    },
  ];

  p5.setup = function () {
    p5.noiseSeed(seed);
    p5.randomSeed(seed);
    p5.colorMode(p5.HSB);
    p5.createCanvas(dimensions.w, dimensions.h);
    p5.noLoop();
    colors.fill = p5.color(p5.random() * 100, p5.random() * 50, p5.random() * 50);
    colors.bg = p5.color(p5.random() * 360, p5.random() * 100, 100);
  };

  p5.draw = function () {
    p5.background(colors.bg);
    for (let i = 0; i <= dimensions.w; i += size) {
      for (let j = 0; j <= dimensions.h; j += size) {
        squareFunctions[Math.floor(p5.random(0, squareFunctions.length))](i, j);
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
