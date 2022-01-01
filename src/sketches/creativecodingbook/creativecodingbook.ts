//@ts-nocheck

import P5 from 'p5';
import { Artwork } from '../../types/artwork';
import { SketchP5Object } from '../../types/sketchP5';

function artwork(p5: P5): void {
  const particles = [];
  const pCount = 400;

  class Particle {
    constructor() {
      this.x = 0;
      this.y = 0;
      this.size = p5.random(0.3, 4);
      this.directionX = p5.random(-1, 1);
      this.directionY = p5.random(-1, 1);
      this.speed = p5.random(0.1, 2);
    }

    move(radius) {
      if (p5.dist(this.x, this.y, 0, 0) > radius) {
        const position = p5.createVector(this.x, this.y);
        const target = p5.createVector(p5.random(-radius, radius), p5.random(-radius, radius));
        const dir = P5.Vector.sub(target, position);
        dir.div(600);
        this.directionX = dir.x;
        this.directionY = dir.y;
      }

      this.x += this.directionX * this.speed;
      this.y += this.directionY * this.speed;
    }

    show() {
      p5.fill(238, 138, this.size * 30);
      p5.ellipse(this.x, this.y, this.size, this.size);
    }
  }

  p5.setup = function () {
    p5.createCanvas(600, 600);
    p5.smooth();
    p5.noStroke();

    for (let i = 0; i < pCount; i++) {
      particles.push(new Particle());
    }
  };

  const drawCloud = (x, y) => {
    p5.push();
    p5.translate(x, y);

    const pLength = particles.length;
    for (let i = 0; i < pLength; i++) {
      particles[i].move(Math.abs(p5.width / 2 - p5.mouseX));
      particles[i].show();
    }
    p5.pop();
  };
  //PAGE75
  p5.draw = function () {
    p5.background(35, 27, 107);
    drawCloud(100, 100);
    const img = p5.get(0, 0, 200, 200);
    p5.tint(255, 255, 200);
    p5.image(img, 200, 0, 200, 200);

    p5.tint(255, 255, 160);
    p5.image(img, 400, 0, 200, 200);

    p5.tint(200, 160, 160);
    p5.image(img, 0, 200, 200, 200);

    p5.tint(200, 120, 80);
    p5.image(img, 200, 200, 200, 200);

    p5.tint(200, 80, 40);
    p5.image(img, 400, 200, 200, 200);
  };

  p5.mousePressed = function () {
    // ellipses[ellipseIndex].set(p5.mouseX, p5.mouseY);
  };

  p5.windowResized = function () {
    //p5.resizeCanvas(window.innerWidth, window.innerHeight);
  };
}

export default function (): Artwork<SketchP5Object> {
  return {
    type: 'P5JS',
    artworkFunction: artwork,
  };
}
