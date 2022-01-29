//@ts-nocheck
import P5 from 'p5';
import { Artwork } from '../../types/artwork';
import { SketchP5ArtworkFunction } from '../../types/sketchP5';
import * as CanvasCapture from 'canvas-capture';

const artwork = (seed: number) => (p5: P5): void => {
  const noRecord = false;
  const fonts = [];
  let textSource,
    bgColA,
    bgColB,
    bgDir,
    angle = 0,
    waveMult,
    tileSizeX,
    tileSizeY,
    recording = false,
    stopped = false;

  const fontVariants = [
    'Thin',
    'Black',
    'Bold',
    'Light',
    'ExtraBold',
    'ExtraLight',
    'Medium',
    'SemiBold',
    'Regular',
  ];

  p5.preload = function () {
    for (let i = 0; i < fontVariants.length; i++) {
      fonts.push(p5.loadFont(`./Inter-${fontVariants[i]}.ttf`));
    }
  };

  const generateTextSource = () => {
    textSource = p5.createGraphics(p5.width, p5.height);
    textSource.pixelDensity(1);

    textSource.colorMode(p5.HSL);

    textSource.textFont(fonts[Math.floor(p5.random(0, fonts.length))]);
    textSource.textSize(250);
    textSource.textAlign(p5.CENTER, p5.BASELINE);
    textSource.fill(0, 100, 100);
    textSource.noStroke();

    const vertSpace = 200;
    const offSet = 65;

    textSource.text('never', textSource.width * 0.5, textSource.height * 0.5 - vertSpace + offSet);

    textSource.text('say', textSource.width * 0.5, textSource.height * 0.5 + offSet);

    textSource.text('never', textSource.width * 0.5, textSource.height * 0.5 + vertSpace + offSet);
  };

  function setGradient(x, y, w, h, c1, c2, axis) {
    p5.noFill();
    p5.blendMode(p5.BLEND);

    if (axis === 0) {
      // Top to bottom gradient
      for (let i = y; i <= y + h; i++) {
        const inter = p5.map(i, y, y + h, 0, 1);
        const c = p5.lerpColor(c1, c2, inter);
        p5.stroke(c);
        p5.line(x, i, x + w, i);
      }
    } else if (axis === 1) {
      // Left to right gradient
      for (let i = x; i <= x + w; i++) {
        const inter = p5.map(i, x, x + w, 0, 1);
        const c = p5.lerpColor(c1, c2, inter);
        p5.stroke(c);
        p5.line(i, y, i, y + h);
      }
    }
  }

  const seedsILike = [
    782538320892, //
    566434456197, //
    1337933392970, //
    1028286037107, //
    1193570898541, //
    1341056214378, //
    827561800582, //
    1589828295311,
  ];

  p5.setup = function () {
    // const seed = Math.round(new Date().getTime() * Math.random());
    const seed = 1589828295311;
    p5.randomSeed(seed);
    console.log('SEED: ', seed);
    p5.createCanvas(800, 800).id('art');
    p5.colorMode(p5.HSL);
    p5.pixelDensity(1);
    p5.frameRate(60);
    bgColA = p5.color(Math.floor(p5.random(360)), 100, Math.floor(p5.random(25, 75)));
    bgColB = p5.color(Math.floor(p5.random(360)), 100, Math.floor(p5.random(25, 75)));
    bgDir = Math.round(p5.random());
    generateTextSource();
    tileSizeX = Math.floor(p5.random(1, 32));
    tileSizeY = Math.floor(p5.random(1, 32));
    waveMult = Math.floor(p5.random(1, 5));
    if (!noRecord) {
      CanvasCapture.init(document.getElementById('art'));
    }
  };

  p5.draw = function () {
    if (!recording && !noRecord) {
      CanvasCapture.beginVideoRecord({ fps: 60 });
      recording = true;
    }

    setGradient(0, 0, p5.width, p5.height, bgColA, bgColB, bgDir);

    const tileW = Math.floor(p5.width / tileSizeX);
    const tileH = Math.floor(p5.height / tileSizeY);

    for (let y = 0; y < tileSizeY; y++) {
      for (let x = 0; x < tileSizeX; x++) {
        const w = Math.cos(angle + x * y) * waveMult;

        // SOURCE
        const mappedValues = p5.map(y, 0, 15, -8, 8, true);
        const sx = x * tileW + w * mappedValues;
        const sy = y * tileH + w * mappedValues;
        const sw = tileW;
        const sh = tileH;

        // DESTINATION
        const dx = x * tileW;
        const dy = y * tileH;
        const dw = tileW;
        const dh = tileH;

        p5.blendMode(p5.OVERLAY);
        p5.drawingContext.drawImage(textSource.canvas, sx, sy, sw, sh, dx, dy, dw, dh);
      }
    }

    angle += 0.01;

    if (!noRecord) {
      if (!stopped) {
        CanvasCapture.recordFrame();
      }

      if (angle >= p5.TWO_PI * 2 && !stopped) {
        stopped = true;
        CanvasCapture.stopRecord();
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
