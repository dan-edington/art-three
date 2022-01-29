//@ts-nocheck
import P5 from 'p5';
import { Artwork } from '../../types/artwork';
import { SketchP5ArtworkFunction } from '../../types/sketchP5';

const artwork = (seed: number) => (p5: P5): void => {
  let pieceSize;
  let patternPiece;
  const pieces = p5.random(2, 5);

  const palletes = [
    ['#650e13', '#1037c6', '#e7cd8e', '#e9efe7', '#c32823'],
    ['#093a93', '#0a090d', '#e7d0cc', '#ee3e8f', '#cab5ee'],
    ['#aaaf24', '#f5d73d', '#eb8a24', '#3f4048', '#140e0e'],
    ['#f0dd95', '#f54826', '#8faab2', '#f5d13b', '#21243d'],
    ['#bfe5fb', '#a75c31', '#d1d4cb', '#253442', '#350f00'],
  ];

  let colors = [];

  function equilateralTriangle(patternPiece, side, cx, cy, angle) {
    const h = side * (Math.sqrt(3) / 2);
    const isFilled = p5.random(1) > 0.3;

    patternPiece.push();
    patternPiece.translate(cx, cy);
    patternPiece.rotate(angle);

    const colors2 = [...colors];
    const strokeColor = colors2.splice(Math.floor(p5.random(colors2.length)), 1);
    const fillColor = colors2.splice(Math.floor(p5.random(colors2.length)), 1);
    patternPiece.stroke(strokeColor);

    if (isFilled) {
      patternPiece.fill(fillColor);
      patternPiece.noStroke();
    } else {
      patternPiece.noFill();
    }

    patternPiece.beginShape();
    patternPiece.vertex(0, -h / 2);
    patternPiece.vertex(-side / 2, h / 2);
    patternPiece.vertex(side / 2, h / 2);
    patternPiece.endShape(p5.CLOSE);

    patternPiece.pop();
  }

  function drawLines(patternPiece, rotation = 0) {
    const isVertical = p5.random(1) > 0.5;
    const numberOfLines = Math.floor(p5.random(1, 5));
    patternPiece.push();
    patternPiece.rotate(rotation);
    for (let i = 0; i < numberOfLines; i++) {
      const lineColor = colors[patternPiece.floor(p5.random(colors.length))];
      patternPiece.strokeWeight(p5.random(1, 10));
      patternPiece.stroke(lineColor);

      if (isVertical) {
        const x = p5.random(0, pieceSize);
        patternPiece.line(x, 0, x, pieceSize);
      } else {
        const y = p5.random(0, pieceSize);
        patternPiece.line(0, y, pieceSize, y);
      }
    }
    patternPiece.pop();
  }

  function generatePattern() {
    p5.fill(0);
    p5.noStroke();

    drawLines(patternPiece, p5.radians(p5.random(360)));

    for (let i = 0; i < 10; i++) {
      const size = p5.random(10, 50);
      equilateralTriangle(
        patternPiece,
        size,
        p5.random(0 + size, pieceSize - size),
        p5.random(0 + size, pieceSize - size),
        p5.random(p5.TWO_PI),
      );
    }
  }

  p5.setup = function () {
    const seed = Math.round(new Date().getTime() * Math.random());
    p5.randomSeed(seed);
    console.log('SEED: ', seed);

    p5.createCanvas(800, 800);
    p5.noLoop();

    pieceSize = Math.round(p5.width / pieces);
    console.log(pieceSize);
    colors = palletes[p5.floor(p5.random(palletes.length))];
    patternPiece = p5.createGraphics(pieceSize, pieceSize);
  };

  p5.draw = function () {
    p5.background(colors.splice(p5.floor(p5.random(colors.length)), 1));

    generatePattern();

    // copy and tile patternpiece across canvas
    for (let x = 0; x < p5.width; x += pieceSize) {
      for (let y = 0; y < p5.height; y += pieceSize) {
        p5.copy(patternPiece, 0, 0, pieceSize, pieceSize, x, y, pieceSize, pieceSize);
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
