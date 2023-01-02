import p5 from 'p5';
import P5 from 'p5';
import { Artwork } from '../../types/artwork';
import { SketchP5ArtworkFunction } from '../../types/sketchP5';

const artwork = (seed: number) => (p5: P5): void => {
  p5.setup = function () {
    p5.noiseSeed(seed);
    p5.randomSeed(seed);

    p5.createCanvas(p5.windowWidth, p5.windowHeight);
    p5.noLoop();
    p5.colorMode(p5.HSB);
  };

  function drawALine(start: p5.Vector, end: p5.Vector, weight: number, color: p5.Color) {
    const linelength = p5.dist(start.x, start.y, end.x, end.y);

    p5.strokeWeight(1.5);
    p5.strokeCap(p5.SQUARE);
    p5.stroke(color);
    p5.noFill();

    const newStart = p5.createVector();
    const noiseScale = p5.random(0.02, 0.002);

    for (let i = 0; i <= linelength; i++) {
      newStart.x = p5.map(i, 0, linelength, start.x, end.x);
      newStart.y = p5.map(i, 0, linelength, start.y, end.y);

      const perpendicular = p5.createVector(0, 0);
      perpendicular.x = (end.y - start.y) * -1;
      perpendicular.y = end.x - start.x;
      perpendicular.normalize().mult(weight);

      const aa = p5.noise(newStart.x * noiseScale, newStart.y * noiseScale);
      const bb = p5.noise(newStart.y * noiseScale, newStart.x * noiseScale);

      p5.line(
        newStart.x - perpendicular.x * aa,
        newStart.y - perpendicular.y * aa,
        newStart.x + perpendicular.x * bb,
        newStart.y + perpendicular.y * bb,
      );
    }
  }

  p5.draw = function () {
    p5.background(346, 7, 79);

    for (let i = 0; i < 15; i++) {
      const start = p5.createVector(p5.random(0, p5.width), p5.random(0, p5.height));
      const end = p5.createVector(p5.random(0, p5.width), p5.random(0, p5.height));
      const color = p5.color(p5.random(0, 36), 74, 93);
      const weight = p5.random(10, 25);
      drawALine(start, end, weight, color);
    }
  };

  p5.windowResized = function () {
    p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
  };
};

export default function (): Artwork<SketchP5ArtworkFunction> {
  return {
    type: 'P5JS',
    artworkFunction: artwork,
  };
}
