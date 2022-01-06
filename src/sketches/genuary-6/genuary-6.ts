//@ts-nocheck
import P5 from 'p5';
import { Artwork } from '../../types/artwork';
import { SketchP5Object } from '../../types/sketchP5';

function artwork(p5: P5): void {
  const colors = [
    '#eb3922',
    '#3fd6ef',
    '#d2d337',
    '#f0c600',
    '#fe1a06',
    '#f18122',
    '#cf5528',
    '#bbab5c',
    '#017b7e',
  ];
  const whites = ['#ffe8d9', '#feead3'];
  const blacks = ['#2c2110', '#2b1307', '#1d0d00'];

  const backgroundColor = whites[Math.floor(p5.random(whites.length))];
  const deg2Rad = (deg) => (deg * Math.PI) / 180;

  const drawRect = (x, y, w, h, color) => {
    const maxOffset = 10;
    x -= w * 0.5;
    y -= h * 0.5;
    x += p5.random(-maxOffset, maxOffset);
    y += p5.random(-maxOffset, maxOffset);
    w += p5.random(-maxOffset, maxOffset);
    h += p5.random(-maxOffset, maxOffset);

    const mid1 = p5.random(x, x + w);
    const mid2 = p5.random(y, y + h);
    const mid3 = p5.random(x, x + w);
    const mid4 = p5.random(y, y + h);

    p5.noStroke();
    p5.fill(color);

    p5.beginShape();

    p5.vertex(x, y);
    p5.vertex(mid1, y + p5.random(-maxOffset, maxOffset));
    p5.vertex(x + w, y);
    p5.vertex(x + w + p5.random(-maxOffset, maxOffset), mid2);
    p5.vertex(x + w, y + h);
    p5.vertex(mid3, y + h + p5.random(-maxOffset, maxOffset));
    p5.vertex(x, y + h);
    p5.vertex(x + p5.random(-maxOffset, maxOffset), mid4);

    p5.endShape(p5.CLOSE);
    p5.rect(x, y, w, h);
  };

  const drawFinger = (startX, startY, endX, endY, color) => {
    p5.stroke(color);
    p5.strokeWeight(25);
    p5.beginShape();
    p5.vertex(startX, startY);
    p5.vertex(endX, endY);
    p5.endShape();
  };

  const drawArm = () => {
    const handColor = blacks[Math.floor(p5.random(blacks.length))];
    p5.noStroke();
    p5.fill(0);

    const armStartPos = p5.createVector(p5.width * 0.5, p5.height);
    const wristPosition = p5.createVector(p5.width * 0.5, p5.height - p5.height * 0.25);
    const elbowPosition = P5.Vector.lerp(armStartPos, wristPosition, 0.5);
    const elbowXRange = 75;
    const elbowYRange = 30;
    elbowPosition.x += p5.random(-elbowXRange, elbowXRange);
    elbowPosition.y += p5.random(-elbowYRange, elbowYRange);

    const fingers = [];
    const fingerCount = 5;
    const fingerSpread = p5.random(0.5, 1);
    const handRotate = 0.7;
    const fingerLength = p5.random(120, 160);

    const startA = deg2Rad(80);
    const endA = deg2Rad(150);
    const aRange = endA - startA;

    for (let i = 0; i < fingerCount; i++) {
      const a = wristPosition.copy();
      const angle = Math.PI * fingerSpread * (i / fingerCount) + Math.PI * handRotate;
      const fingerScale = Math.sin(startA + i * (aRange / fingerCount)) * 0.75;
      const fl = fingerLength * fingerScale;
      a.x += Math.sin(angle) * fl;
      a.y += Math.cos(angle) * fl;
      fingers.push(a);
    }

    p5.strokeCap(p5.PROJECT);
    p5.strokeJoin(p5.MITER);
    p5.stroke(handColor);
    p5.strokeWeight(80);
    p5.noFill();

    p5.beginShape();
    p5.vertex(armStartPos.x, armStartPos.y);
    p5.vertex(elbowPosition.x, elbowPosition.y);
    p5.vertex(wristPosition.x, wristPosition.y);
    p5.endShape();

    fingers.forEach((finger) => {
      drawFinger(wristPosition.x, wristPosition.y, finger.x, finger.y, handColor);
    });
  };

  const drawTexture = () => {
    const rez = 1;
    p5.blendMode(p5.BURN);
    p5.noStroke();
    const bc = p5.color(backgroundColor);
    for (let x = 0; x < p5.width; x += rez) {
      for (let y = 0; y < p5.height; y += rez) {
        const n = p5.noise(x * 0.002, y * 0.002);
        const c = p5.color(n * bc.levels[0], n * bc.levels[1], n * bc.levels[2], 64);
        p5.fill(c);
        p5.rect(x, y, rez, rez);
      }
    }
  };

  p5.setup = function () {
    p5.createCanvas(800, 800);
    p5.background(backgroundColor);
    p5.noLoop();
  };

  p5.draw = function () {
    const border = 25;
    const blocks = Math.floor(p5.random(2, 6));
    const h = Math.floor((p5.height - border * 2) / blocks);
    let prevColorIndex = null;
    let colorIndex = null;

    // Draw background
    for (let i = 0; i < blocks; i++) {
      while (colorIndex === prevColorIndex) {
        colorIndex = Math.floor(p5.random(colors.length));
      }
      prevColorIndex = colorIndex;

      drawRect(
        p5.width * 0.5, //xPos
        border + h * i + h * 0.5, //yPos
        p5.width - border * 2, //width
        h, //height
        colors[colorIndex],
      );
    }

    // Draw hand
    drawArm();

    drawTexture();
  };
}

export default function (): Artwork<SketchP5Object> {
  return {
    type: 'P5JS',
    artworkFunction: artwork,
  };
}
