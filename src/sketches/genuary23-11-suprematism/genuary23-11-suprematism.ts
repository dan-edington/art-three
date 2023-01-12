import P5 from 'p5';
import { Artwork } from '../../types/artwork';
import { SketchP5ArtworkFunction } from '../../types/sketchP5';

const artwork = (seed: number) => (p5: P5): void => {
  const texture = p5.createGraphics(800, 800);

  const palletes = [
    [
      p5.color('#f6edf0'),
      p5.color('#1e1e25'),
      p5.color('#f5c13e'),
      p5.color('#0992b1'),
      p5.color('#dd1d19'),
    ],
  ];

  let pallete: P5.Color[];

  const generateNoiseTexture = (random: boolean) => {
    texture.background(0);
    texture.loadPixels();
    for (let i = 0; i < texture.pixels.length; i += 4) {
      const index = i / 8;
      const x = index % texture.width;
      const y = Math.floor(index / texture.width);

      let n;

      if (p5.random() > 0.75) {
        n = Math.floor(p5.random() * 255);
      } else {
        n = Math.floor(p5.noise(x * 0.0042, y * 0.0043) * 255);
      }

      n = p5.map(n, 0, 255, 175, 255);
      texture.pixels[i] = n;
      texture.pixels[i + 1] = n;
      texture.pixels[i + 2] = n;
      texture.pixels[i + 3] = 255;
    }
    texture.updatePixels();
  };

  p5.setup = function () {
    p5.noiseSeed(seed);
    p5.randomSeed(seed);

    p5.createCanvas(800, 800);
    pallete = p5.random(palletes);
    p5.noLoop();
  };

  const drawARectangle = () => {
    const isThin = p5.random() > 0.75;
    const rectHeight = isThin ? p5.random(400, 600) : p5.random(50, 250);
    const rectWidth = isThin ? p5.random(20, 100) : p5.random(50, 250);
    const maxOffset = 3;
    const inset = Math.max(rectWidth, rectHeight);

    p5.push();
    p5.translate(p5.random(inset, p5.width - inset), p5.random(inset, p5.height - inset));
    p5.rotate(p5.random(p5.TWO_PI));
    p5.fill(p5.random(pallete));
    p5.noStroke();
    p5.beginShape();

    p5.vertex(0 + p5.random(-maxOffset, maxOffset), 0 + p5.random(-maxOffset, maxOffset));
    p5.vertex(0 + p5.random(-maxOffset, maxOffset), rectWidth + p5.random(-maxOffset, maxOffset));
    p5.vertex(
      rectHeight + p5.random(-maxOffset, maxOffset),
      rectWidth + p5.random(-maxOffset, maxOffset),
    );
    p5.vertex(rectHeight + p5.random(-maxOffset, maxOffset), 0 + p5.random(-maxOffset, maxOffset));

    p5.endShape();
    p5.pop();
  };

  const drawACircle = () => {
    const ellipseSize = p5.random(75, 250);
    const inset = ellipseSize;
    const maxOffset = ellipseSize * 0.05;

    p5.push();
    p5.translate(p5.random(inset, p5.width - inset), p5.random(inset, p5.height - inset));
    p5.rotate(p5.random(p5.TWO_PI));
    p5.fill(p5.random(pallete));
    p5.noStroke();
    const offsetDirection = p5.random() > 0.5;
    p5.ellipse(
      0,
      0,
      ellipseSize + (offsetDirection ? 0 : p5.random(-maxOffset, maxOffset)),
      ellipseSize + (!offsetDirection ? 0 : p5.random(-maxOffset, maxOffset)),
    );
    p5.pop();
  };

  p5.draw = function () {
    const bg = pallete.shift();
    p5.background(bg);
    for (let i = 0; i < 4; i++) {
      drawARectangle();
    }
    drawACircle();
    //@ts-ignore
    generateNoiseTexture();
    p5.blendMode(p5.OVERLAY);
    p5.image(texture, 0, 0);
  };
};

export default function (): Artwork<SketchP5ArtworkFunction> {
  return {
    type: 'P5JS',
    artworkFunction: artwork,
  };
}
