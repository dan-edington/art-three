import P5 from 'p5';
import { Artwork } from '../../types/artwork';
import { SketchP5ArtworkFunction } from '../../types/sketchP5';

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

  // const drawSunflower = (position: P5.Vector, size: number, zoom: number, scale: number) => {
  //   const img = sunflowerImages[Math.floor(p5.random(0, sunflowerImages.length))];

  //   // create mask
  //   const mask = p5.createGraphics(size, size);
  //   mask.fill('blue');
  //   mask.noStroke();
  //   mask.ellipseMode(p5.CENTER);
  //   mask.ellipse(size * 0.5, size * 0.5, size);

  //   // p5.tint(255, p5.random(64, 255));

  //   const newImg = p5.createImage(size, size);
  //   newImg.copy(
  //     img,
  //     img.width * 0.25,
  //     img.height * 0.25,
  //     size * zoom,
  //     size * zoom,
  //     0,
  //     0,
  //     size,
  //     size,
  //   );

  //   //@ts-ignore
  //   newImg.mask(mask);

  //   p5.image(newImg, position.x, position.y, size * scale, size * scale);
  //   // p5.image(
  //   //   img,
  //   //   position.x - size * 0.5,
  //   //   position.y - size * 0.5,
  //   //   size * 2,
  //   //   size * 2,
  //   //   img.width * 0.5 - size,
  //   //   img.height * 0.5 - size,
  //   //   size * scale,
  //   //   size * scale,
  //   // );
  // };

  const drawCutoutImage = (
    img: P5.Image,
    position: P5.Vector,
    jaginess: number,
    scale: number,
    rotation: number,
  ) => {
    // resize image
    const resizedImage = p5.createImage(img.width, img.height);
    resizedImage.copy(
      img,
      0,
      0,
      img.width,
      img.height,
      0,
      0,
      resizedImage.width,
      resizedImage.height,
    );
    resizedImage.resize(img.width * scale, img.height * scale);

    // create mask
    const mask = p5.createGraphics(resizedImage.width, resizedImage.height);
    mask.fill(128);
    mask.noStroke();
    mask.beginShape();

    const maxPieces = 10;
    const minPieces = 1;
    const divisionOffsetScale = p5.map(jaginess, 10, 30, 0.5, 0.1);
    const inset = jaginess;
    const offsetAmount = jaginess;

    // top left
    mask.vertex(inset * 2, inset * 2);

    // top
    const topInbetween = Math.floor(p5.random(minPieces, maxPieces));
    for (let i = 0; i < topInbetween; i++) {
      const x =
        (resizedImage.width / (topInbetween + 2)) * (i + 1) +
        p5.random(-offsetAmount * divisionOffsetScale, offsetAmount * divisionOffsetScale);
      const y = inset + p5.random(-offsetAmount, offsetAmount);
      mask.vertex(x, y);
    }

    // top right
    mask.vertex(resizedImage.width - inset * 2, inset * 2);

    // right
    const rightInbetween = Math.floor(p5.random(minPieces, maxPieces));
    for (let i = 0; i < rightInbetween; i++) {
      const x = resizedImage.width - inset + p5.random(-offsetAmount, offsetAmount);
      const y =
        (resizedImage.height / (rightInbetween + 2)) * (i + 1) +
        p5.random(-offsetAmount * divisionOffsetScale, offsetAmount * divisionOffsetScale);
      mask.vertex(x, y);
    }

    // bottom right
    mask.vertex(resizedImage.width - inset * 2, resizedImage.height - inset * 2);

    // bottom
    const bottomInbetween = Math.floor(p5.random(minPieces, maxPieces));
    for (let i = bottomInbetween - 1; i >= 0; i--) {
      const x =
        (resizedImage.width / (bottomInbetween + 2)) * (i + 1) +
        p5.random(-offsetAmount * divisionOffsetScale, offsetAmount * divisionOffsetScale);
      const y = resizedImage.height - inset + p5.random(-offsetAmount, offsetAmount);
      mask.vertex(x, y);
    }

    // bottom left
    mask.vertex(inset * 2, resizedImage.height - inset * 2);

    // left
    const leftInbetween = Math.floor(p5.random(minPieces, maxPieces));
    for (let i = leftInbetween - 1; i >= 0; i--) {
      const x = inset + p5.random(-offsetAmount, offsetAmount);
      const y =
        (resizedImage.height / (leftInbetween + 2)) * (i + 1) +
        p5.random(-offsetAmount * divisionOffsetScale, offsetAmount * divisionOffsetScale);
      mask.vertex(x, y);
    }

    mask.endShape(p5.CLOSE);

    const newImage = p5.createImage(resizedImage.width, resizedImage.height);
    newImage.copy(
      resizedImage,
      0,
      0,
      resizedImage.width,
      resizedImage.height,
      0,
      0,
      resizedImage.width,
      resizedImage.height,
    );
    //@ts-ignore
    newImage.mask(mask);
    newImage.resize(resizedImage.width, resizedImage.height);

    p5.push();
    p5.translate(position.x, position.y);
    p5.rotate(rotation);

    p5.image(
      newImage,
      0 - resizedImage.width * 0.5,
      0 - resizedImage.height * 0.5,
      resizedImage.width,
      resizedImage.height,
    );

    p5.pop();
  };

  p5.setup = function () {
    p5.randomSeed(seed);
    p5.noiseSeed(seed);
    p5.createCanvas(size, size);
    p5.noLoop();
  };

  p5.draw = function () {
    p5.background(255);
    const count = 16;

    // p5.blendMode(p5.MULTIPLY);

    for (let i = 0; i < count; i++) {
      const x = p5.random(0, p5.width);
      const y = p5.random(0, p5.height);
      const img = sunflowerImages[Math.floor(p5.random(0, sunflowerImages.length))];
      const scale = p5.random(0.25, 1.25);
      const jaginess = Math.floor(p5.random(10, 30));
      const rotation = p5.random(0, Math.PI * 2);
      drawCutoutImage(img, p5.createVector(x, y), jaginess, scale, rotation);
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
