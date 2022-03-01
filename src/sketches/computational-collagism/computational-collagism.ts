import P5 from 'p5';
import { Artwork } from '../../types/artwork';
import { SketchP5ArtworkFunction } from '../../types/sketchP5';
import { map } from '../../util/math';

/*
SEEDS:

*/

const artwork = (seed: number) => (p5: P5): void => {
  const pallete = [
    p5.color('#255AB5'),
    p5.color('#F7D648'),
    // p5.color('#000000'),
    // p5.color('#dfdfdf'),
  ];

  const sunflowerImages: Array<P5.Image> = new Array(6);

  const size = 900;

  p5.preload = function () {
    for (let i = 1; i <= sunflowerImages.length; i++) {
      const img = p5.loadImage(`./computational-collagism/sunflower${i}.jpeg`);
      sunflowerImages[i - 1] = img;
    }
  };

  const colorOverlay = () => {
    p5.blendMode(p5.SCREEN);
    p5.noStroke();
    p5.fill(pallete[0]);
    p5.rect(0, 0, p5.width, p5.height * 0.5);
    p5.fill(pallete[1]);
    p5.rect(0, p5.height * 0.5, p5.width, p5.height);
  };

  const drawSunflower = (position: P5.Vector, size: number, zoom: number, scale: number) => {
    const img = sunflowerImages[Math.floor(p5.random(0, sunflowerImages.length))];

    const mask = p5.createGraphics(size, size);
    // mask.pixelDensity(1);
    mask.fill('blue');
    mask.noStroke();
    mask.ellipseMode(p5.CENTER);
    mask.ellipse(size * 0.5, size * 0.5, size);

    // p5.tint(255, p5.random(64, 255));

    const newImg = p5.createImage(size, size);
    newImg.copy(
      img,
      img.width * 0.5 - size,
      img.height * 0.5 - size,
      size * zoom,
      size * zoom,
      0,
      0,
      size,
      size,
    );

    //@ts-ignore
    newImg.mask(mask);

    p5.image(newImg, position.x, position.y, size * scale, size * scale);
    // p5.image(
    //   img,
    //   position.x - size * 0.5,
    //   position.y - size * 0.5,
    //   size * 2,
    //   size * 2,
    //   img.width * 0.5 - size,
    //   img.height * 0.5 - size,
    //   size * scale,
    //   size * scale,
    // );
  };

  p5.setup = function () {
    p5.randomSeed(seed);
    p5.noiseSeed(seed);
    p5.createCanvas(size, size);
    p5.noLoop();
  };

  p5.draw = function () {
    p5.background(255);
    const count = 10;
    const maxSize = 150;
    const minSize = 100;

    // p5.blendMode(p5.MULTIPLY);

    for (let i = 0; i < count; i++) {
      const x = p5.random(0, p5.width);
      const y = p5.random(0, p5.height);
      const size = Math.floor(p5.random(minSize, maxSize));
      const zoom = map(size, minSize, maxSize, 5, 2);
      const scale = p5.random(1, 3);
      drawSunflower(p5.createVector(x, y), size, zoom, scale);
    }
    // p5.filter(p5.GRAY);

    // colorOverlay();
  };
};

export default function (): Artwork<SketchP5ArtworkFunction> {
  return {
    type: 'P5JS',
    artworkFunction: artwork,
  };
}
