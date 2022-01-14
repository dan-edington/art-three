//@ts-nocheck
import P5 from 'p5';
import { Artwork } from '../../types/artwork';
import { SketchP5Object } from '../../types/sketchP5';

function artwork(p5: P5): void {
  class Particle {
    constructor(x: number, y: number) {
      this.pos = p5.createVector(x, y);
      this.prevPos = this.pos.copy();
      this.acc = p5.createVector(0, 0);
      this.vel = p5.createVector(0, 0);
    }

    update() {
      this.vel.add(this.acc);
      this.vel.limit(4);
      this.pos.add(this.vel);
      this.acc.mult(0);
    }

    applyForce(force) {
      this.acc.add(force);
    }

    updatePrevPos() {
      this.prevPos = this.pos.copy();
    }

    checkEdges() {
      if (this.pos.x > p5.width) {
        this.pos.x = 0;
        this.updatePrevPos();
      }
      if (this.pos.x < 0) {
        this.pos.x = p5.width;
        this.updatePrevPos();
      }
      if (this.pos.y > p5.height) {
        this.pos.y = 0;
        this.updatePrevPos();
      }
      if (this.pos.y < 0) {
        this.pos.y = p5.height;
        this.updatePrevPos();
      }
    }

    follow(flowField) {
      const x = Math.floor(this.pos.x);
      const y = Math.floor(this.pos.y);
      const index = x + y * p5.width;
      const force = flowField[index];
      this.applyForce(force);
    }

    draw() {
      p5.blendMode(p5.DODGE);
      p5.colorMode(p5.RGB);
      p5.noFill();
      p5.strokeWeight(0.5);
      p5.stroke(255, 255, 255, 24);
      p5.line(this.prevPos.x, this.prevPos.y, this.pos.x, this.pos.y);
      this.updatePrevPos();
    }
  }

  const generateFlowField = () => {
    const field = [];
    const inc = 0.1;
    let xOff = 0;
    let yOff = 0;
    for (let x = 0; x < p5.width; x++) {
      for (let y = 0; y < p5.height; y++) {
        const angle = p5.noise(xOff, yOff) * p5.TWO_PI;
        field.push(P5.Vector.fromAngle(angle));
        xOff += inc;
      }
      yOff += inc;
    }
    return field;
  };

  let ff, p;

  p5.setup = function () {
    p5.noLoop();
    p5.createCanvas(800, 80);
    p5.colorMode(p5.HSL);
    p5.background(
      Math.floor(p5.random(0, 360)),
      Math.floor(p5.random(0, 100)),
      Math.floor(p5.random(0, 100)),
    );

    ff = generateFlowField();
    p = new Particle(p5.random(0, p5.width), p5.random(0, p5.height));

    for (let i = 0; i < 20000; i++) {
      p.follow(ff);
      p.update();
      p.checkEdges();
      p.draw();
    }
  };

  p5.draw = function () {};
}

export default function (): Artwork<SketchP5Object> {
  return {
    type: 'P5JS',
    artworkFunction: artwork,
  };
}
