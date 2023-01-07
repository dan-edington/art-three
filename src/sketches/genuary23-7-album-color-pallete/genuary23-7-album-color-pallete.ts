import P5 from 'p5';
import { Artwork } from '../../types/artwork';
import { SketchP5ArtworkFunction } from '../../types/sketchP5';

const artwork = (seed: number) => (p5: P5): void => {
  let bgColor: P5.Color;
  const pallete = [
    p5.color('#fafefc'),
    p5.color('#000000'),
    p5.color('#331111'),
    p5.color('#8b161a'),
    p5.color('#ffa3a5'),
    p5.color('#cc242c'),
    p5.color('#f15965'),
    p5.color('#f03345'),
  ];

  p5.setup = function () {
    p5.noiseSeed(seed);
    p5.randomSeed(seed);

    p5.createCanvas(800, 800);
    p5.noLoop();

    bgColor = pallete.splice(p5.floor(p5.random(pallete.length)), 1)[0];
  };

  p5.draw = function () {
    p5.background(bgColor);
    p5.noStroke();

    let x = 1.0;
    let y = 1.0;
    const z = 0;

    // const a = 0.65343;
    // const b = 0.7345345;
    const a = p5.random(-1, 1);
    const b = p5.random(-1, 1);
    const c = 28;

    p5.beginShape();
    const strokeColor = pallete.splice(p5.floor(p5.random(pallete.length)), 1)[0];
    strokeColor.setAlpha(64);
    p5.noFill();
    p5.stroke(strokeColor);
    p5.strokeWeight(0.1);

    // generat a list of all p5.blendModes
    const blendModes = [
      'ADD',
      'BLEND',
      'BURN',
      'DARKEST',
      'DIFFERENCE',
      'DODGE',
      'DARKEST',
      'SUBTRACT',
      'EXCLUSION',
      'HARD_LIGHT',
      'LIGHTEST',
      'SUBTRACT',
      'MULTIPLY',
      'SCREEN',
      'REPLACE',
      'OVERLAY',
      'SOFT_LIGHT',
      'REMOVE',
    ];
    //@ts-ignore'
    const blendMode = blendModes[p5.floor(p5.random(blendModes.length))];

    //@ts-ignore'

    p5.blendMode(p5[blendMode]);
    console.log(blendMode);

    const maxSize = 20;

    for (let i = 0; i < 100000000; i++) {
      // const dt = 0.01;
      // const dx = a * (y - x) * dt;
      // const dy = (x * (c - z) - y) * dt;
      // const dz = (x * y - b * z) * dt;

      // x = x + dx;
      // y = y + dy;
      // z = z + dz;
      x = Math.sin((x * y) / b) * y + Math.cos(a * x - y);
      y = x + Math.sin(y) / b;

      const positionX = p5.map(x, -maxSize, maxSize, 0, p5.width);
      const positionY = p5.map(y, -maxSize, maxSize, 0, p5.height);

      // p5.noStroke();
      // p5.fill(pallete[p5.floor(p5.random(pallete.length))]);
      // p5.circle(positionX, positionY, 1);

      p5.curveVertex(positionX, positionY);
    }

    p5.endShape();
  };
};

export default function (): Artwork<SketchP5ArtworkFunction> {
  return {
    type: 'P5JS',
    artworkFunction: artwork,
  };
}
