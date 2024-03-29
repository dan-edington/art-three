import P5 from 'p5';
import { Artwork } from '../../types/artwork';
import { SketchP5ArtworkFunction } from '../../types/sketchP5';

const artwork = (seed: number) => (p5: P5): void => {
  let canvas: P5.Renderer;
  let colors: Record<string, any>;

  const makeColorScheme = () => {
    const bgHue = Math.floor(p5.noise(p5.random() * 91, p5.random() * 19) * 361);
    const bg = p5.color(bgHue, 10, p5.random(8, 19), 1.0);

    const paintHue = Math.floor(p5.noise(p5.random() * 23, p5.random() * 9996) * 361);
    const paint = p5.color(paintHue, 50, 500, 1.0);

    return {
      bg,
      paint,
    };
  };

  p5.setup = function () {
    p5.noiseSeed(seed);
    p5.randomSeed(seed);

    p5.colorMode(p5.HSB);
    colors = makeColorScheme();

    canvas = p5.createCanvas(600, 600);
    p5.noLoop();
  };

  const drawThing = function (target: P5) {
    let prevX = null;
    let prevY = null;

    const drawDots = p5.random() > 0.5;
    const radius = 150;
    const numpoints = Math.round(p5.random(75, 200));
    const xMult = p5.random(0.001, 10);
    const yMult = xMult + p5.random(-2.5, 2.5);

    console.log(`numpoints: ${numpoints}`);
    console.log(`xMult: ${xMult}`);
    console.log(`yMult: ${yMult}`);

    const xPhase = p5.random(-1000, 1000);
    const yPhase = p5.random(-1000, 1000);

    target.push();
    target.translate(p5.width / 2, p5.height / 2);

    const drawCurves = p5.random() > 0.5;

    if (drawCurves) {
      target.beginShape();
    }

    for (let i = 0; i < numpoints; i++) {
      const a = p5.random(-19, 19);

      const xPos = Math.sin(i * xMult + xPhase) * (radius + a);
      const yPos = Math.cos(i * yMult + yPhase) * (radius + a);
      const dotsize = p5.noise(xPos, yPos) * 4;

      if (drawDots) {
        colors.paint.setAlpha(100);
        target.fill(colors.paint);
        target.noStroke();
        target.ellipse(xPos, yPos, dotsize);
      }

      colors.paint.setAlpha(32);
      target.strokeWeight(p5.random(0.5, 2));
      target.noFill();
      target.stroke(colors.paint);

      if (drawCurves) {
        target.curveVertex(xPos, yPos);
      } else {
        if (prevX !== null && prevY !== null) {
          target.line(prevX, prevY, xPos, yPos);
        }
      }

      prevX = xPos;
      prevY = yPos;
    }

    if (drawCurves) {
      target.endShape();
    }

    target.pop();
  };

  const drawBackground = function (target: P5) {
    target.noStroke();
    target.fill(colors.bg);
    target.rect(0, 0, target.width, target.height);
  };

  const drawNoiseOverlay = function (opacity: number) {
    const _overlay = p5.createGraphics(p5.width, p5.height);

    _overlay.fill(255);
    _overlay.noStroke();
    _overlay.rect(0, 0, _overlay.width, _overlay.height);

    const overlay = _overlay.get();

    overlay.loadPixels();
    const d = 1;
    const noiseMult = p5.random(0.1, 1000000);
    const noisePatchiness = 0.12;
    for (let x = 0; x < overlay.width; x++) {
      for (let y = 0; y < overlay.height; y++) {
        const i = 4 * d * (y * d * overlay.width + x);
        if (p5.noise(x * noiseMult, y * noiseMult) > noisePatchiness && p5.random() > 0.19) {
          overlay.pixels[i] = 0;
          overlay.pixels[i + 1] = 0;
          overlay.pixels[i + 2] = 0;
          overlay.pixels[i + 3] = 0;
        } else {
          overlay.pixels[i] = 0;
          overlay.pixels[i + 1] = 0;
          overlay.pixels[i + 2] = 0;
          overlay.pixels[i + 3] = 255;
        }
      }
    }
    overlay.updatePixels();

    p5.blendMode(p5.MULTIPLY);
    p5.tint(255, opacity);
    p5.image(overlay, 0, 0, p5.width, p5.height);
    p5.noTint();
  };

  p5.draw = function () {
    const regularBuffer = p5.createGraphics(p5.width, p5.height);
    drawThing(regularBuffer);

    let blurredBuffer = regularBuffer.get();
    blurredBuffer.filter(p5.BLUR, 1);
    blurredBuffer.filter(p5.BLUR, 20);
    blurredBuffer.filter(p5.BLUR, 30);

    p5.tint(255, 0.8);
    p5.image(blurredBuffer.get(), 0, 0, p5.width, p5.height);
    p5.noTint();

    blurredBuffer = p5.get();

    drawBackground(p5);

    const spread = 75;
    p5.image(blurredBuffer.get(), -spread, -spread, p5.width + spread * 2, p5.height + spread * 2);
    drawNoiseOverlay(0.2);
    p5.blendMode(p5.HARD_LIGHT);
    p5.image(regularBuffer.get(), 0, 0, p5.width, p5.height);
    drawNoiseOverlay(0.25);
  };
};

export default function (): Artwork<SketchP5ArtworkFunction> {
  return {
    type: 'P5JS',
    artworkFunction: artwork,
  };
}
