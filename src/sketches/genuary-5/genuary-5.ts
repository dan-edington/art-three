//@ts-nocheck
import P5 from 'p5';
import { Artwork } from '../../types/artwork';
import { SketchP5ArtworkFunction } from '../../types/sketchP5';

const artwork = (seed: number) => (p5: P5): void => {
  const squareSize = 300;
  const speedLimit = 4;
  const squares = [];
  const start = 30;
  const colors = ['rgba(255, 38, 125,', 'rgba(87, 0, 255,', 'rgba(246, 209, 0,'];
  const color = colors[Math.floor(p5.random(0, colors.length - 0))];
  const thinga = p5.random(0.005, 10.1); //0.021;
  const thingb = p5.random(0.005, 10.1); //0.014;
  const whata = p5.random(0.001, 10); //0.2;
  const whatb = p5.random(0.005, 10.9); //0.5;

  class Particle {
    constructor(x, y) {
      this.pos = p5.createVector(x, y);
      this.prevPos = this.pos.copy();
      this.vel = p5.createVector(0, 0);
      this.acc = p5.createVector(0, 0);
      this.rotation = 0;
      this.friction = 0.92;
      this.size = 1;
      this.alpha = 255;
      this.alphaRate = p5.random(0.08, 0.008); //0.008;
      this.lineAlpha = 1;
      this.lineSize = p5.random(1, 5);
      this.lineColor = color;
    }

    update() {
      this.vel.add(this.acc);
      this.vel.mult(this.friction);
      this.vel.limit(speedLimit);
      this.pos.add(this.vel);
      this.acc.mult(0);
      this.rotation += p5.random(-0.001, 0.001);
      this.alpha -= this.alphaRate;
      this.lineAlpha -= this.alphaRate;
      // this.size += 0.025;
    }

    setPrevious() {
      this.prevPos = this.pos.copy();
    }

    applyForce(force) {
      this.acc.add(force);
    }

    drawPoint() {
      p5.push();
      p5.rotate(this.rotation);
      p5.fill(255, this.alpha);
      p5.noStroke();
      p5.rectMode(p5.CENTER);
      p5.rect(this.pos.x, this.pos.y, this.size, this.size);
      p5.pop();
    }

    drawLine() {
      p5.noFill();
      p5.strokeWeight(this.lineSize);
      p5.stroke(`${this.lineColor}${Math.max(0, this.lineAlpha)})`);
      p5.line(this.pos.x, this.pos.y, this.prevPos.x, this.prevPos.y);
    }
  }

  p5.setup = function () {
    p5.createCanvas(600, 600);
    // p5.noLoop();
    p5.background(0);

    for (let x = 0; x < squareSize; x += 0.5) {
      for (let y = 0; y < squareSize; y += 0.5) {
        if (x === 0 || y === 0 || x === squareSize - 1 || y === squareSize - 1) {
          squares.push(new Particle(Math.round(x), Math.round(y)));
        }
      }
    }
  };

  p5.draw = function () {
    // p5.background(0);
    p5.push();
    p5.translate(p5.width / 2 - squareSize * 0.5, p5.height / 2 - squareSize * 0.5);

    const squareLength = squares.length;
    const ab = Math.tan(p5.frameCount / thinga) * whata + thingb;
    for (let i = 0; i < squareLength; i++) {
      const a = Math.sin((i * thinga) / ab) * whata;
      const b = Math.cos(i * thingb + a) * whatb;

      const f = p5.frameCount > start ? a : 0;
      const f2 = p5.frameCount > start ? b : 0;

      const square = squares[i];
      square.applyForce(p5.createVector(f, f2));
      square.update();
      square.drawLine();
      square.setPrevious();
    }

    p5.pop();
  };
};

export default function (): Artwork<SketchP5ArtworkFunction> {
  return {
    type: 'P5JS',
    artworkFunction: artwork,
  };
}
