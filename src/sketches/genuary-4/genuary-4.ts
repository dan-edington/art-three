//@ts-nocheck
import P5 from 'p5';
import { Artwork } from '../../types/artwork';
import { SketchP5Object } from '../../types/sketchP5';

function artwork(p5: P5): void {
  const scale = 10;
  const particleCount = p5.random(5, 10);
  const particles = [];
  const flowField = [];
  let cols;
  const framesToRender = 600;

  const strokeColors = [
    '7BA9BF',
    'F7B1A1',
    'FBBC18',
    '543E2E',
    '28A791',
    'DB5054',
    '1E3359',
    'B8D9CD',
    'E57C33',
    'DFD7C5',
    'D02B2F',
    '3B2B20',
  ];

  class Particle {
    constructor(x: number, y: number) {
      this.lifeTime = p5.random(25, framesToRender);
      this.pos = p5.createVector(x, y);
      this.strokeWeight = Math.floor(p5.random(5, 40));
      this.prevPos = this.pos.copy();
      this.acc = p5.createVector(0, 0);
      this.vel = p5.createVector(0, 0);
      this.strokeColor = strokeColors[Math.floor(p5.random(0, strokeColors.length - 1))];
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

    follow() {
      const x = Math.floor(this.pos.x / scale);
      const y = Math.floor(this.pos.y / scale);
      const index = x + y * cols;
      const force = flowField[index];
      this.applyForce(force);
    }

    draw() {
      if (this.lifeTime <= 0) {
        return;
      }

      p5.noFill();
      p5.strokeCap(p5.PROJECT);
      p5.strokeJoin(p5.MITER);
      p5.strokeWeight(this.strokeWeight);
      p5.stroke(`#${this.strokeColor}`);
      p5.line(this.pos.x, this.pos.y, this.prevPos.x, this.prevPos.y);
      this.updatePrevPos();
      this.lifeTime--;
    }
  }

  const generateFF = () => {
    const inc = p5.random(0.001, 0.0001);
    let xOff = p5.random(0, 100);
    let yOff = p5.random(0, 100);
    let zOff = p5.random(0, 100);
    for (let x = 0; x < p5.width; x += scale) {
      for (let y = 0; y < p5.height; y += scale) {
        const a = P5.Vector.fromAngle(p5.noise(xOff, yOff, zOff) * p5.TWO_PI);
        a.setMag(0.01);
        flowField.push(a);
        xOff += inc;
      }
      yOff += inc;
      zOff += inc;
    }
  };

  p5.setup = function () {
    p5.noLoop();
    p5.createCanvas(600, 600);
    p5.pixelDensity(2);
    for (let i = 0; i < particleCount; i++) {
      const p = new Particle(p5.random(0, p5.width), p5.random(0, p5.height));
      particles.push(p);
    }
    generateFF();
    cols = Math.floor(p5.width / scale);
    p5.background('#EBE4D8');
  };

  p5.draw = function () {
    const l = particles.length;
    for (let i = 0; i < framesToRender; i++) {
      for (let j = 0; j < l; j++) {
        const p = particles[j];
        p.follow();
        p.update();
        p.checkEdges();
        p.draw();
      }
    }
  };
}

export default function (): Artwork<SketchP5Object> {
  return {
    type: 'P5JS',
    artworkFunction: artwork,
  };
}
