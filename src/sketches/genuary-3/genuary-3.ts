//@ts-nocheck
import P5 from 'p5';
import { Artwork } from '../../types/artwork';
import { SketchP5Object } from '../../types/sketchP5';

function artwork(p5: P5): void {
  const minRadius = p5.random(2, 5);
  const maxRadius = p5.random(200, 500);
  const numberOfCircles = 800;
  const maxAttempts = 4096;

  const circles = [];
  const hue = p5.random(0, 100);

  class Circle {
    constructor() {
      this.valid = true;
      this.radius = p5.random(minRadius, maxRadius);
      this.color = p5.color(hue, 50, p5.random(30, 70));
      this.x = p5.random(0, p5.width);
      this.y = p5.random(0, p5.height);
    }

    testOverlap() {
      const l = circles.length;
      for (let i = 0; i < l; i++) {
        const distance =
          p5.dist(this.x, this.y, circles[i].x, circles[i].y) - circles[i].radius - this.radius;
        if (distance < 0) {
          this.valid = false;
        }
      }
    }

    grow() {
      while (this.valid) {
        if (this.radius < maxRadius) {
          this.radius += 1;
        }
        this.testOverlap();
      }
      if (!this.valid) {
        this.radius -= 1;
      }
    }

    draw() {
      p5.noStroke();
      p5.fill(this.color);
      p5.ellipseMode(p5.CENTER);
      p5.ellipse(this.x, this.y, this.radius * 2);
    }
  }

  p5.setup = function () {
    p5.colorMode(p5.HSL, 100);
    p5.noLoop();
    p5.createCanvas(800, 800);
    for (let i = 0; i < numberOfCircles; i++) {
      let valid = false;
      let c;
      let attempts = 0;
      while (!valid) {
        attempts++;
        if (attempts >= maxAttempts) {
          break;
        }
        c = new Circle();
        c.testOverlap();
        if (c.valid) {
          valid = true;
        }
      }
      if (c?.valid) {
        circles.push(c);
        c.grow();
        c.draw();
      }
    }
  };

  p5.draw = function () {
    p5.background(0, 0, p5.random(10, 70));
    const l = circles.length;
    for (let i = 0; i < l; i++) {
      circles[i].draw();
    }
  };
}

export default function (): Artwork<SketchP5Object> {
  return {
    type: 'P5JS',
    artworkFunction: artwork,
  };
}
