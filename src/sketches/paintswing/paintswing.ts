import P5 from 'p5';
import { Artwork } from '../../types/artwork';
import { SketchP5ArtworkFunction } from '../../types/sketchP5';

const artwork = (seed: number) => (p5: P5): void => {
  const colorScheme = [
    {
      bg: p5.color('hsla(186, 72%, 5%, 1.0)'),
      paint: p5.color('hsla(36, 88%, 82%, 0.25)'),
    },
    {
      bg: p5.color('hsla(186, 72%, 5%, 1.0)'),
      paint: p5.color('hsla(112, 90%, 67%, 0.25)'),
    },
  ];

  let colors: Record<string, any>;

  p5.setup = function () {
    colors = colorScheme[Math.floor(p5.random(colorScheme.length))];
    p5.noiseSeed(seed);
    p5.randomSeed(seed);
    p5.createCanvas(600, 600);
    p5.background(colors.bg);
    p5.noLoop();
  };

  p5.draw = function () {
    const drawDots = p5.random() > 0.5;
    const drawLines = p5.random() > 0.25;
    const radius = 155;
    const numpoints = 400 * p5.random(1, 3);

    const xMult = p5.random(0.001, 10);
    const yMult = p5.random(0.001, 10);

    let prevX = null;
    let prevY = null;
    p5.push();
    p5.translate(p5.width / 2, p5.height / 2);
    const rotate = Math.floor(p5.random(1, 4));
    p5.rotate(p5.PI / rotate);

    for (let i = 0; i < numpoints; i++) {
      const xPos = Math.sin(i * xMult) * radius;
      const yPos = Math.cos(i * yMult) * radius;
      const dotsize = p5.noise(xPos, yPos) * 4;

      if (drawDots) {
        colors.paint.setAlpha(255);
        p5.fill(colors.paint);
        p5.noStroke();
        p5.ellipse(xPos, yPos, dotsize);
      }

      if (drawLines) {
        colors.paint.setAlpha(32);
        p5.strokeWeight(1);
        p5.noFill();
        p5.stroke(colors.paint);
      }

      if (prevX !== null && prevY !== null) {
        p5.line(prevX, prevY, xPos, yPos);
      }

      prevX = xPos;
      prevY = yPos;
    }
    p5.pop();
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
