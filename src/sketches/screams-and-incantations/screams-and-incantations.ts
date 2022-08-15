import p5 from 'p5';
import P5 from 'p5';
import { Artwork } from '../../types/artwork';
import { SketchP5ArtworkFunction } from '../../types/sketchP5';

const artwork = (seed: number) => (p5: P5): void => {
  const dimensions = { width: 670, height: 1000 };
  const borderWidth = 25;

  const colors = [p5.color('#1C1D1A'), p5.color('#f7f5e5')];

  if (p5.random() > 0.5) {
    colors.reverse();
  }

  const colors2 = [p5.color('#b10f2e'), p5.color('#9AB00E'), p5.color('#0E4CB0')];

  let noiseOverlay: P5.Graphics;

  p5.setup = function () {
    p5.noiseSeed(seed);
    p5.randomSeed(seed);
    p5.createCanvas(dimensions.width, dimensions.height);
    noiseOverlay = p5.createGraphics(dimensions.width, dimensions.height);
    p5.noLoop();
  };

  const drawBorder = (): void => {
    p5.blendMode(p5.BLEND);
    p5.stroke(colors[1]);
    p5.noFill();
    p5.strokeWeight(borderWidth * 2);
    p5.rect(0, 0, dimensions.width, dimensions.height);
  };

  const applyNoiseOverlay = (): void => {
    noiseOverlay.loadPixels();
    const detail = 0.1;
    const noisefloor = 128;
    const alpha = 64;

    for (let x = 0; x < p5.width; x++) {
      const noiseX = x * detail + p5.random(0, 75);
      for (let y = 0; y < p5.height; y++) {
        const noiseY = y * detail + p5.random(0, 25);
        const n = p5.noise(noiseX, noiseY) * 255 + noisefloor;
        noiseOverlay.set(x, y, p5.color(n, n, n, alpha));
      }
    }
    noiseOverlay.updatePixels();
    p5.blendMode(p5.BURN);
    p5.image(noiseOverlay, 0, 0, p5.width, p5.height);
  };

  const drawThing = (): void => {
    const a = p5.createGraphics(dimensions.width, dimensions.height);
    a.noStroke();
    let yPos = 0;
    const rotateMax = 0.15;

    while (yPos < dimensions.height) {
      a.push();
      a.translate(dimensions.width / 2, dimensions.height / 2);
      a.rotate(p5.random(-rotateMax, rotateMax));
      const yOff = p5.random(-50, 0);
      const xOff = p5.random(-100, 100);
      const alpha = p5.random(1, 172);
      const w = p5.random(100, dimensions.width * 0.75);
      const h = 1;
      colors[1].setAlpha(alpha);
      a.fill(colors[1]);
      a.rect(w * -0.5 + xOff, dimensions.height / 2 - yPos + yOff, w, h);
      yPos += h;
      a.pop();
    }
    colors[1].setAlpha(255);

    const count = p5.random(10, 100);
    for (let i = 0; i < count; i++) {
      p5.image(
        a,
        p5.random() * dimensions.width, // destination x
        p5.random() * dimensions.height, // destination y
        p5.random() * dimensions.width * 0.5, // destination w
        p5.random() * dimensions.height * 0.5, // destination h
        p5.random() * dimensions.width * 0.5, // source x
        p5.random() * dimensions.height, //source y
        dimensions.width, // source w
        dimensions.height, // source h
      );
    }
  };

  const paintOverlays = () => {
    const overlayCount = Math.round(p5.random(1, 4));
    const a = p5.createGraphics(dimensions.width, dimensions.height);

    for (let i = 0; i < overlayCount; i++) {
      const c = colors2[Math.round(p5.random(0, colors2.length - 1))];
      c.setAlpha(p5.random(25, 50));
      a.stroke(c);
      a.strokeWeight(p5.random(250, 500));
      a.strokeCap(p5.SQUARE);
      a.noFill();

      if (p5.random() > 0.5) {
        //ltr
        const startY = p5.random(0, dimensions.height);
        const endY = p5.random(0, dimensions.height);
        a.line(0 - 100, startY, dimensions.width + 100, endY);
      } else {
        //ttb
        const startX = p5.random(0, dimensions.width);
        const endX = p5.random(0, dimensions.width);
        a.line(startX, 0 - 100, endX, dimensions.height + 100);
      }
    }

    a.filter(p5.BLUR, 250);
    p5.image(a, 0, 0, dimensions.width, dimensions.height);
  };

  const applyDistortion = () => {
    const distort = (
      input: p5,
      wavinessX: number,
      wavinessY: number,
      periodX: number,
      periodY: number,
    ) => {
      const output = p5.createImage(input.width, input.height);
      input.loadPixels();
      output.loadPixels();
      for (let y = 0; y < input.height; y++) {
        for (let x = 0; x < input.width; x++) {
          // this formula is where the magic happens!
          // we calculate new x/y position and grab pixels
          // from the source image at that location
          const tempX = x + wavinessX * Math.sin(x / periodX);
          const tempY = y + wavinessY * Math.sin(y / periodY);
          const px = input.get(tempX, tempY);

          // then put those colors into the output
          // image at the regular x/y position
          output.set(x, y, px);
        }
      }
      output.updatePixels();
      return output;
    };

    p5.image(
      distort(p5, p5.random(1, 500), p5.random(1, 500), p5.random(50, 500), p5.random(50, 500)),
      0,
      0,
      dimensions.width,
      dimensions.height,
    );
  };

  const drawLines = () => {
    p5.blendMode(p5.BLEND);
    p5.stroke(colors[0]);
    p5.noFill();
    const lineCount = Math.round(p5.random(1, 50));
    for (let i = 0; i < lineCount; i++) {
      p5.strokeWeight(Math.round(p5.random(1, 5)));
      const startY = p5.noise(p5.random(), i) * dimensions.height;
      const endY = p5.noise(p5.random(), i) * dimensions.height;
      p5.line(0, startY, dimensions.width, endY);
    }
  };

  p5.draw = function () {
    p5.background(colors[0]);
    drawThing();
    // applyDistortion();
    drawLines();
    paintOverlays();
    drawBorder();
    applyNoiseOverlay();
  };

  p5.windowResized = function () {
    p5.resizeCanvas(dimensions.width, dimensions.height);
  };
};

export default function (): Artwork<SketchP5ArtworkFunction> {
  return {
    type: 'P5JS',
    artworkFunction: artwork,
  };
}
