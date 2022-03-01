import P5 from 'p5';
import { Artwork } from '../../types/artwork';
import { SketchP5ArtworkFunction } from '../../types/sketchP5';

/*
SEEDS:
704533665443
155886698777
1469267824587
185552810222
568302445769
504583409659
1353508536524
739184037602
765750511181
1251325995349
1393757821946
1593487533796
1212863139133
1618151481409
85196780735
1288887673963
218334494909
987230861321
1550353129644
515991930439
*/

const artwork = (seed: number) => (p5: P5): void => {
  const pallete = [
    p5.color('#459476'),
    p5.color('#2a4498'),
    p5.color('#000000'),
    p5.color('#dfdfdf'),
  ];

  const tintPallete = [pallete[0], pallete[1]];

  const imageCount = 13;
  const images: Array<P5.Image> = [];
  let rows: Array<number>, cols: Array<number>;

  const size = 900;
  const blankChance = 0.15;
  const sizeOffsetRange = 300;
  const piecesMax = 6;
  const scaleMin = 0.3;
  const overlayMaxOpacity = 0.5;

  const generateGridAxis = (): Array<number> => {
    const gridAxis = [];
    const numberOfPieces = Math.floor(p5.random(1, piecesMax));
    const averageSize = size / numberOfPieces;
    let difference = 0;
    for (let i = 0; i < numberOfPieces; i++) {
      const sizeOffset = Math.floor(p5.random(-sizeOffsetRange, sizeOffsetRange));
      const size = averageSize + sizeOffset;
      difference += size - averageSize;
      gridAxis.push(size);
    }
    gridAxis[numberOfPieces - 1] = gridAxis[numberOfPieces - 1] - difference;
    return gridAxis;
  };

  const drawCollagePiece = (
    img: P5.Image,
    color: P5.Color,
    xPos: number,
    yPos: number,
    rowSize: number,
    colSize: number,
  ) => {
    if (img) {
      p5.tint(color);
      const selectedImage = images[Math.floor(p5.random(0, images.length))];
      const sx = Math.floor(p5.random(0, selectedImage.width - rowSize));
      const sy = Math.floor(p5.random(0, selectedImage.height - colSize));
      const scale = p5.random(scaleMin, 1);
      p5.image(
        selectedImage,
        xPos,
        yPos,
        colSize,
        rowSize,
        sx,
        sy,
        colSize * scale,
        rowSize * scale,
      );
    } else {
      p5.noStroke();
      p5.fill(color);
      p5.rect(xPos, yPos, colSize, rowSize);
    }
  };

  const overlayRandomImage = () => {
    const img = images[Math.floor(p5.random(images.length))];
    p5.tint(255, 255 * p5.random(0.1, overlayMaxOpacity));
    p5.blendMode(p5.DODGE);
    const scale = p5.random(scaleMin, 1);
    p5.image(img, 0, 0, size, size, 0, 0, size * scale, size * scale);
  };

  p5.preload = function () {
    for (let i = 1; i <= imageCount; i++) {
      const img = p5.loadImage(`./computational-collagism/${i}.jpeg`);
      images.push(img);
    }
  };

  p5.setup = function () {
    p5.randomSeed(seed);
    p5.createCanvas(size, size);
    p5.noLoop();
    cols = generateGridAxis();
    rows = generateGridAxis();
  };

  p5.draw = function () {
    p5.background(0);

    let xPos = 0;
    let yPos = 0;

    for (let i = 0; i < rows.length; i++) {
      for (let j = 0; j < cols.length; j++) {
        const img = p5.random() > blankChance ? images[Math.floor(p5.random(images.length))] : null;
        let color;
        if (img) {
          color = tintPallete[Math.floor(p5.random(tintPallete.length))];
        } else {
          color = pallete[Math.floor(p5.random(pallete.length))];
        }
        drawCollagePiece(img, color, xPos, yPos, rows[i], cols[j]);
        xPos += cols[j];
      }
      yPos += rows[i];
      xPos = 0;
    }
    overlayRandomImage();
  };
};

export default function (): Artwork<SketchP5ArtworkFunction> {
  return {
    type: 'P5JS',
    artworkFunction: artwork,
  };
}
