import P5 from 'p5';
import { Artwork } from '../../types/artwork';
import { SketchP5Object } from '../../types/sketchP5';

function artwork(p5: P5): void {
  const colours = {
    red: p5.color(135, 3, 17),
    blue: p5.color(9, 37, 87),
    yellow: p5.color(211, 179, 15),
  };

  p5.setup = function () {
    p5.createCanvas(800, 800);
    p5.noLoop();
  };

  p5.draw = function () {
    p5.background(208, 170, 208);
    p5.stroke(246, 173, 113);
    p5.strokeWeight(5);
    p5.fill(113, 70, 132);

    p5.scale(0.4);
    p5.ellipse(200, 200, 355, 355);

    p5.resetMatrix();
    p5.ellipse(400, 400, 355, 355);
  };

  p5.windowResized = function () {
    //p5.resizeCanvas(window.innerWidth, window.innerHeight);
  };
}

export default function (): Artwork<SketchP5Object> {
  return {
    type: 'P5JS',
    artworkFunction: artwork,
  };
}
