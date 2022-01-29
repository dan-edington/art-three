//@ts-nocheck
import P5 from 'p5';
import { Artwork } from '../../types/artwork';
import { SketchP5ArtworkFunction } from '../../types/sketchP5';

import * as CanvasCapture from 'canvas-capture';

const artwork = (seed: number) => (p5: P5): void => {
  const center = p5.createVector(p5.windowWidth / 2, p5.windowHeight / 2);
  let nX = new Date().getTime() * Math.random();
  let nY = new Date().getTime() * Math.random();
  let nD = new Date().getTime() * Math.random();
  let nO = new Date().getTime() * Math.random();
  let xVariance = 1;
  let yVariance = 1;
  let chance = 1;
  let stopped = false;
  let recording = false;

  const createRow = (count, yPos, padding, xVariance, yVariance) => {
    const points = [];
    const space = (p5.width - padding * 2) / (count - 1);

    for (let i = 0; i < count; i++) {
      nY += Math.random() * 0.6;
      nX += Math.random() * 0.75;
      const x = i * space + padding + (p5.noise(nX) * xVariance - xVariance);
      const y = yPos + (p5.noise(nY) * yVariance - yVariance);
      points.push(p5.createVector(x, y));
    }

    return points;
  };

  const createGrid = (xCount, yCount, padding, xVariance, yVariance) => {
    const points = [];
    const space = (p5.height - padding * 2) / (yCount - 1);

    for (let i = 0; i < yCount; i++) {
      points.push(...createRow(xCount, i * space + padding, padding, xVariance, yVariance));
    }

    return points;
  };

  p5.setup = function () {
    const w = 600;
    p5.createCanvas(w, w * 1.411).id('art');
    // p5.noLoop();
    p5.frameRate(9);
    CanvasCapture.init(document.getElementById('art'));
  };

  p5.draw = function () {
    if (!recording) {
      CanvasCapture.beginVideoRecord({ fps: 9 });
      recording = true;
    }

    p5.background(0);
    p5.noStroke();
    const xCount = 40;
    const yCount = 15;
    chance -= 0.01;
    xVariance += p5.random(-0.25, 0.25);
    yVariance += p5.random(-0.3, 0.3);
    const padding = 75;
    const points = createGrid(xCount, yCount, padding, xVariance, yVariance);

    points.forEach((p) => {
      nD += Math.random();
      nO += Math.random() * 0.5;
      p5.fill(`rgba(255,255,255, ${p5.noise(nO) * 0.45 + 0.3})`);
      p5.circle(p.x, p.y, p5.noise(nD) * 10 + 1);
    });

    points.forEach((p, i) => {
      const endP = points?.[i + xCount] || null;
      if (endP) {
        nO += Math.random() * 0.5;
        p5.stroke(`rgba(255,255,255, ${p5.noise(nO) * 0.1 + 0.2})`);
        if (Math.random() <= chance) {
          p5.line(p.x, p.y, endP.x, endP.y);
        }
      }
    });

    if (!stopped) {
      CanvasCapture.recordFrame();
    }

    if (p5.frameCount >= 120 && !stopped) {
      stopped = true;
      CanvasCapture.stopRecord();
    }
  };
};

export default function (): Artwork<SketchP5ArtworkFunction> {
  return {
    type: 'P5JS',
    artworkFunction: artwork,
  };
}
