import P5 from 'p5';
import { Artwork } from '../../types/artwork';
import { SketchP5ArtworkFunction } from '../../types/sketchP5';

const artwork = (seed: number) => (p5: P5): void => {
  p5.setup = function () {
    p5.noiseSeed(seed);
    p5.randomSeed(seed);

    p5.createCanvas(600, 1000);
    p5.noLoop();
  };

  const drawTentacle = (position: P5.Vector, length: number) => {
    const vertexCount = 5;
    p5.stroke('#5ED945');
    p5.strokeWeight(100);
    p5.noFill();
    let prevX: number;
    let prevY: number;
    p5.beginShape();

    for (let i = 0; i < vertexCount; i++) {
      let xPos, yPos;
      if (typeof prevX === 'undefined' && typeof prevY === 'undefined') {
        xPos = position.x;
        yPos = position.y;
      } else {
        xPos = prevX;
        yPos = prevY - length;
      }

      p5.vertex(xPos, yPos);

      prevX = xPos;
      prevY = yPos;
    }

    p5.endShape();
  };

  p5.draw = function () {
    p5.background('#54A4C2');
    drawTentacle(new P5.Vector(300, 800), 100);
  };
};

export default function (): Artwork<SketchP5ArtworkFunction> {
  return {
    type: 'P5JS',
    artworkFunction: artwork,
  };
}
