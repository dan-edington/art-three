// @ts-nocheck

// DRAW 10,000 OF SOMETHING

import P5 from 'p5';
import { Artwork } from '../../types/artwork';
import { SketchP5ArtworkFunction } from '../../types/sketchP5';

const artwork = (seed: number) => (p5: P5): void => {
  p5.setup = function () {
    p5.createCanvas(800, 800);
    p5.noLoop();
  };

  const drawBlob = (xPos, yPos, radius, smoothness, seed) => {
    // p5.blendMode(p5.SUBTRACT);
    p5.colorMode(p5.HSL, 100);
    const radOffMax = 10;
    // const g = p5.drawingContext.createLinearGradient(
    //   xPos - radius,
    //   yPos - radius,
    //   xPos + radius,
    //   yPos + radius,
    // );

    const g = p5.drawingContext.createRadialGradient(
      xPos,
      yPos,
      radius * 0.01,
      xPos,
      yPos,
      radius + radOffMax,
    );

    p5.drawingContext.fillStyle = g;

    const c1 = p5.color(
      p5.random(0, 100), //Hue
      p5.random(80, 100), //Saturation
      p5.random(25, 100), //Lightness
      p5.random(50, 100), //Alpha
    );

    const c2 = p5.color(
      p5.random(0, 100), //Hue
      p5.random(80, 100), //Saturation
      p5.random(25, 100), //Lightness
      p5.random(50, 100), //Alpha
    );

    g.addColorStop(0, c1.toString());
    g.addColorStop(1, c2.toString());

    p5.push();

    p5.beginShape();

    for (let i = 0; i < Math.PI * 2; i += smoothness) {
      const radOffset = radius + p5.map(p5.noise(seed * i), 0, 1, -radOffMax, radOffMax);
      const x = Math.sin(i) * radOffset;
      const y = Math.cos(i) * radOffset;
      p5.curveVertex(x + xPos, y + yPos);
    }

    p5.endShape(p5.CLOSE);

    p5.pop();
  };

  p5.draw = function () {
    p5.background(0);
    p5.noStroke();

    for (let i = 0; i <= 10000; i++) {
      drawBlob(
        p5.random(p5.width),
        p5.random(p5.height),
        p5.random(10, 50),
        0.3,
        p5.random(0, 10000),
      );
    }
  };

  // p5.windowResized = function () {
  //   p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
  // };
};

export default function (): Artwork<SketchP5ArtworkFunction> {
  return {
    type: 'P5JS',
    artworkFunction: artwork,
  };
}
