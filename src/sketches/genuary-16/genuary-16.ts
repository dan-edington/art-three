//@ts-nocheck
import P5 from 'p5';
import { Artwork } from '../../types/artwork';
import { SketchP5Object } from '../../types/sketchP5';

function artwork(p5: P5): void {
  let sourceImage;

  function setGradient(x, y, w, h, c1, c2, axis, sourceImg = p5) {
    sourceImg.noFill();
    sourceImg.blendMode(p5.ADD);
    sourceImg.colorMode(p5.HSL);
    // sourceImg.blendMode(p5.BLEND);

    if (axis === 0) {
      // Top to bottom gradient
      for (let i = y; i <= y + h; i++) {
        const inter = p5.map(i, y, y + h, 0, 1);
        const c = p5.lerpColor(c1, c2, inter);
        sourceImg.stroke(c);
        sourceImg.line(x, i, x + w, i);
      }
    } else if (axis === 1) {
      // Left to right gradient
      for (let i = x; i <= x + w; i++) {
        const inter = p5.map(i, x, x + w, 0, 1);
        const c = p5.lerpColor(c1, c2, inter);
        sourceImg.stroke(c);
        sourceImg.line(i, y, i, y + h);
      }
    }
  }

  const generateSourceImage = () => {
    sourceImage = p5.createGraphics(p5.width, p5.height);
    const bgColA = p5.color(
      Math.floor(p5.random(360)),
      Math.floor(p5.random(50, 100)),
      Math.floor(p5.random(25, 85)),
    );
    const bgColB = p5.color(
      Math.floor(p5.random(360)),
      Math.floor(p5.random(50, 100)),
      Math.floor(p5.random(25, 85)),
    );
    const bgDir = Math.round(p5.random());
    setGradient(0, 0, p5.width, p5.height, bgColA, bgColB, bgDir, sourceImage);
  };

  const seedsILike = [
    1150904281087,
    386112280633,
    1103798918114,
    305628975457,
    1525942324785,
    1315079870783,
    1575857649937,
    416656875643,
    114571245983,
    615710459603,
    1039358378094,
    396848146683,
    1438911016788,
    1298503803717,
    1034027586320,
    802648655286,
    1031920551355,
    257394663981,
    208925125915,
    151681515838,
    1248592161884,
    1636913993700,
    142935981912,
    1086403345525,
    1234293556761,
  ];

  p5.setup = function () {
    // const seed = Math.round(new Date().getTime() * Math.random());
    const seed = 1150904281087;
    // const seed = seedsILike[Math.floor(Math.random() * seedsILike.length)];
    p5.randomSeed(seed);
    console.log('SEED: ', seed);
    p5.colorMode(p5.HSL);

    p5.createCanvas(800, 800);
    p5.noLoop();
    generateSourceImage();
  };

  p5.draw = function () {
    p5.background(255);

    const tileSizeX = Math.floor(p5.random(1, p5.width * p5.random(0.001, 0.1)));
    const tileSizeY = Math.floor(p5.random(1, p5.height * p5.random(0.001, 0.1)));
    const tileW = Math.ceil(p5.width / tileSizeX);
    const tileH = Math.ceil(p5.height / tileSizeY);

    p5.drawingContext.drawImage(
      sourceImage.canvas,
      0,
      0,
      p5.width,
      p5.height,
      0,
      0,
      p5.width,
      p5.height,
    );

    for (let y = 0; y < tileSizeY; y++) {
      for (let x = 0; x < tileSizeX; x++) {
        // SOURCE
        const sx = x * tileW;
        const sy = y * tileH;
        const sw = tileW;
        const sh = tileH;

        // DESTINATION
        const dx = Math.floor(p5.random(p5.width));
        const dy = Math.floor(p5.random(p5.height));
        const dw = tileW * p5.random(3);
        const dh = tileH * p5.random(3);

        p5.blendMode(p5.OVERLAY);
        p5.drawingContext.drawImage(sourceImage.canvas, sx, sy, sw, sh, dx, dy, dw, dh);
      }
    }
    p5.blendMode(p5.OVERLAY);
    p5.stroke(255);
    p5.strokeWeight(30);
    p5.noFill();
    p5.rect(0, 0, p5.width, p5.height);

    p5.filter(p5.BLUR, 4);
  };
}

export default function (): Artwork<SketchP5Object> {
  return {
    type: 'P5JS',
    artworkFunction: artwork,
  };
}
