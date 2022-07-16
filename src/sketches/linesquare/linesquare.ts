import P5 from 'p5';
import { Artwork } from '../../types/artwork';
import { SketchP5ArtworkFunction } from '../../types/sketchP5';

const artwork = (seed: number) => (p5: P5): void => {
  const squareSize = 400;
  const thinLineWidth = Math.round(p5.random(1, 10));
  const lineWidth = Math.round(p5.random(thinLineWidth, 10));
  p5.colorMode(p5.HSB, 360, 100, 100, 1);

  const colors = {
    background: p5.color(44, 0, 16),
    square: p5.color(44, 88, 7),
    line: p5.color(44, 0, 26),
  };

  p5.setup = function () {
    p5.noiseSeed(seed);
    p5.randomSeed(seed);

    p5.createCanvas(p5.windowWidth, p5.windowHeight);
  };

  const drawBackground = () => {
    p5.background(colors.background);
    p5.push();
    p5.translate(p5.width / 2, p5.height / 2);
    p5.fill(colors.square);
    p5.noStroke();
    p5.rectMode(p5.CENTER);
    p5.rect(0, 0, squareSize, squareSize);
    p5.pop();
  };

  const drawLines = () => {
    const lineCount = squareSize / lineWidth;
    const minThickLength = squareSize * 0.15;
    const maxThickLength = squareSize * 0.35;

    p5.strokeWeight(lineWidth);
    p5.stroke(colors.line);
    p5.strokeCap(p5.SQUARE);
    p5.push();

    p5.translate(p5.width / 2 - squareSize / 2, p5.height / 2 - squareSize / 2);

    for (let i = 0; i < lineCount; i++) {
      let yPos = 0;
      const length = p5.random(minThickLength, maxThickLength);
      const xPos = 0 + lineWidth / 2 + i * lineWidth;
      const lineTopOffset = p5.noise(i * 0.05) * (squareSize - length);

      p5.strokeWeight(thinLineWidth);
      p5.line(xPos, 0, xPos, yPos + lineTopOffset);

      p5.strokeWeight(lineWidth);
      yPos = yPos + lineTopOffset;
      p5.line(xPos, yPos, xPos, yPos + length);

      p5.strokeWeight(thinLineWidth);
      yPos = yPos + length;
      p5.line(xPos, yPos, xPos, squareSize);
    }

    p5.pop();
  };

  p5.draw = function () {
    p5.noLoop();

    drawBackground();
    drawLines();
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
