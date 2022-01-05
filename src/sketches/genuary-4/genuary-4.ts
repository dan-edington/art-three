//@ts-nocheck
import P5 from 'p5';
import { Artwork } from '../../types/artwork';
import { SketchP5Object } from '../../types/sketchP5';

function artwork(p5: P5): void {
  const scale = 10;
  const particles = [];
  const flowField = [];
  const particleCount = 100;
  let col;
  let row;

  class Particle {
    constructor(x: number, y: number) {
      this.pos = p5.createVector(x, y);
      this.acc = p5.createVector(0, 0);
      this.vel = p5.createVector(0, 0);
    }

    update() {
      this.vel.add(this.acc);
      this.pos.add(this.vel);
      this.acc.mult(0);
    }

    applyForce(force: P5.Vector) {
      this.acc.add(force);
    }

    checkEdges() {
      if (this.pos.x > p5.width) {
        this.pos.x = 0;
      } else if (this.pos.x < 0) {
        this.pos.x = p5.width;
      }

      if (this.pos.y > p5.height) {
        this.pos.y = 0;
      } else if (this.pos.y < 0) {
        this.pos.y = p5.height;
      }
    }

    follow() {
      const x = Math.floor(this.pos.x / scale);
      const y = Math.floor(this.pos.y / scale);
      const index = x + y * 80;
      const force = flowField[index];
      this.applyForce(force);
    }

    draw() {
      p5.noStroke();
      p5.fill(255);
      p5.circle(this.pos.x, this.pos.y, 5);
    }
  }

  const generateFF = () => {
    for (let x = 0; x < p5.width; x += scale) {
      for (let y = 0; y < p5.height; y += scale) {
        const a = P5.Vector.fromAngle(p5.noise(x * 0.0186, y * 0.0134) * p5.TWO_PI);
        flowField.push(a);
      }
    }
  };

  p5.setup = function () {
    // p5.noLoop();
    p5.createCanvas(800, 800);
    for (let i = 0; i < particleCount; i++) {
      const p = new Particle(p5.random(0, p5.width), p5.random(0, p5.height));
      particles.push(p);
    }
    generateFF();
  };

  p5.draw = function () {
    p5.background(0);
    const l = particles.length;
    for (let i = 0; i < l; i++) {
      const p = particles[i];
      p.follow();
      p.update();
      p.checkEdges();
      p.draw();
    }
  };
}

export default function (): Artwork<SketchP5Object> {
  return {
    type: 'P5JS',
    artworkFunction: artwork,
  };
}
