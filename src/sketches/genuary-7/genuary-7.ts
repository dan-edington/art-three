//@ts-nocheck
import P5 from 'p5';
import { Artwork } from '../../types/artwork';
import { SketchP5ArtworkFunction } from '../../types/sketchP5';

const artwork = (seed: number) => (p5: P5): void => {
  const colors = ['#ae3849', '#e8d74b', '#1c9bb2', '#cb5f4b', '#047faf', '#c6607b', '#008150'];
  let noiseOverlay;

  p5.setup = function () {
    p5.createCanvas(600 * 1.7, 600);
    p5.noLoop();
    noiseOverlay = p5.createGraphics(600 * 1.7, 600);
  };

  const applyFilter = () => {
    noiseOverlay.loadPixels();
    const detail = 0.0175;
    const noisefloor = 64;
    const alpha = 32;
    for (let x = 0; x < p5.width; x++) {
      for (let y = 0; y < p5.height; y++) {
        const n = p5.noise(x * detail, y * detail) * 255 + noisefloor;
        noiseOverlay.set(x, y, p5.color(n, n, n, alpha));
      }
    }
    noiseOverlay.updatePixels();
    p5.blendMode(p5.BURN);
    p5.image(noiseOverlay, 0, 0, p5.width, p5.height);
  };

  const waveLengthMultiplier = p5.random(0.1, 2.0);
  let ampMultiplier = p5.random(50, 350);

  const drawWobble = (yPos) => {
    p5.beginShape();
    let prevColorIndex = null;
    let colorIndex = null;

    waveLengthMultiplier + p5.random(0.25);
    ampMultiplier += p5.random(-100, 100);

    for (let i = 0; i < p5.width; i++) {
      p5.noStroke();
      while (colorIndex === prevColorIndex) {
        colorIndex = Math.floor(p5.random(colors.length));
      }
      prevColorIndex = colorIndex;
      p5.fill(colors[colorIndex]);
      const angle = i * 0.006 - Math.PI;
      const amp = Math.cos(angle * waveLengthMultiplier) * ampMultiplier;
      const y = yPos + Math.cos(angle) * amp;
      const vert = p5.createVector(i, y);
      p5.vertex(vert.x, vert.y);
    }

    p5.vertex(p5.width, p5.height);
    p5.vertex(0, p5.height);
    p5.endShape();
  };

  p5.draw = function () {
    p5.background('#94877E');

    for (let i = -200; i < p5.height + 200; i += 100) {
      drawWobble(i + p5.random(-40, 40));
    }

    applyFilter();
  };
};

export default function (): Artwork<SketchP5ArtworkFunction> {
  return {
    type: 'P5JS',
    artworkFunction: artwork,
  };
}
