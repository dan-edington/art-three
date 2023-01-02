import P5 from 'p5';
import { Artwork } from '../../types/artwork';
import { SketchP5ArtworkFunction } from '../../types/sketchP5';
import { CanvasCapture } from 'canvas-capture';

const palletes = [
  [
    [200, 159, 156],
    [38, 35, 34],
    [130, 174, 177],
    [240, 133, 183],
    [244, 211, 94],
  ],
];

const artwork = (seed: number) => (p5: P5): void => {
  const noRecord = false;

  let recording = false;
  let stopped = false;

  let colorPallete: P5.Color[] = [];
  const fr = 30;
  const count = 20;
  const droplets: droplet[] = [];
  let iteration = 0;

  const colorsFromPallete = (index: number) => {
    const pallete = palletes[index];
    return pallete.map((c) => p5.color(c[0], c[1], c[2]));
  };

  class droplet {
    position: P5.Vector;
    startSize: number;
    growRate: number;
    size: number;
    isGrowing: boolean;
    color: P5.Color;

    constructor(position: P5.Vector, startSize: number, growRate: number, color: P5.Color) {
      this.position = position;
      this.startSize = startSize;
      this.growRate = growRate;
      this.size = 0;
      this.isGrowing = true;
      this.color = color;
    }

    randomizePosition() {
      this.position = p5.createVector(p5.random(p5.width), p5.random(p5.height));
    }

    randomizeSize() {
      this.startSize = p5.random(1, 10);
    }

    randomizeGrowRate() {
      this.growRate = p5.random(1, 5);
    }

    setColor(color: P5.Color) {
      this.color = color;
    }

    reset() {
      this.size = this.startSize;
      this.isGrowing = true;
    }

    stop() {
      this.isGrowing = false;
    }

    update() {
      if (this.isGrowing) {
        this.size += this.growRate;
      }
      p5.fill(this.color);
      p5.noStroke();
      p5.circle(this.position.x, this.position.y, this.size);
    }
  }

  p5.setup = function () {
    p5.noiseSeed(seed);
    p5.randomSeed(seed);
    p5.frameRate(fr);
    p5.createCanvas(500, 500);

    colorPallete = colorsFromPallete(Math.floor(p5.random(palletes.length)));
    p5.noise;
    for (let i = 0; i < count; i++) {
      droplets.push(
        new droplet(
          p5.createVector(
            p5.noise(i * p5.width * p5.random(1, 10)) * p5.width,
            p5.noise(p5.height * i * p5.random(1, 10)) * p5.height,
          ),
          p5.random(1, 2),
          p5.random(1, 3),
          colorPallete[iteration + 1],
        ),
      );
    }

    if (!noRecord) {
      CanvasCapture.init(document.querySelector('.p5Canvas') as HTMLCanvasElement);
    }
  };

  const isCanvasFilled = (color: P5.Color) => {
    const c = color.toString();
    // 835667467592
    // 125522396729
    return (
      p5.color(p5.get(0, 0)).toString() === c &&
      p5.color(p5.get(p5.width - 1, 0)).toString() === c &&
      p5.color(p5.get(0, p5.height - 1)).toString() === c &&
      p5.color(p5.get(p5.width - 1, p5.height - 1)).toString() === c
    );
  };

  p5.draw = function () {
    if (!recording && !noRecord) {
      CanvasCapture.beginVideoRecord({ fps: fr });
      recording = true;
    }

    p5.background(colorPallete[iteration]);

    for (const d of droplets) {
      d.update();
    }

    if (isCanvasFilled(droplets[0].color)) {
      iteration++;
      if (iteration === colorPallete.length) {
        p5.noLoop();
        console.log('done');
      }
      for (const d of droplets) {
        const nextColorIndex = iteration + 1;

        if (nextColorIndex === colorPallete.length) {
          d.setColor(colorPallete[0]);
        } else {
          d.setColor(colorPallete[nextColorIndex]);
        }

        d.randomizeGrowRate();
        d.randomizeSize();
        d.reset();
      }
    }

    if (!noRecord) {
      if (!stopped) {
        CanvasCapture.recordFrame();
      }

      if (iteration === colorPallete.length) {
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
