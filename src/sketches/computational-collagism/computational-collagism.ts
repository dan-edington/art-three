import P5 from 'p5';
import { Artwork } from '../../types/artwork';
import { SketchP5ArtworkFunction } from '../../types/sketchP5';

/*
SEEDS:
1234552636658
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
629628517245
*/

const artwork = (seed: number) => (p5: P5): void => {
  const pallete = [
    p5.color('#255AB5'),
    p5.color('#F7D648'),
    p5.color('#000000'),
    p5.color('#dfdfdf'),
  ];

  const tintPallete = [pallete[0], pallete[1]];
  const bgPallete = [pallete[2], pallete[3]];

  const fonts: Array<P5.Font> = [];
  const fontVariants = [
    'Thin',
    'Black',
    'Bold',
    'Light',
    'ExtraBold',
    'ExtraLight',
    'Medium',
    'SemiBold',
    'Regular',
  ];

  const imageCount = 6; //13;
  const images: Array<P5.Image> = [];
  let rows: Array<number>, cols: Array<number>;

  const size = 900;
  const blankChance = 0.4;
  const textChance = 0;
  let textDrawn = false;
  const axisPiecesMax = 6;
  const gridCols = 12;
  const imageSourceOffsetRange = 100;
  const sizeOffsetRange = Math.floor(size / axisPiecesMax);
  const scaleMin = 0.3;
  const overlayMaxOpacity = 0.5;

  const generateGridAxis = (): Array<number> => {
    // const averageSize = size / numberOfPieces;
    // let difference = 0;
    // for (let i = 0; i < numberOfPieces; i++) {
    //   const sizeOffset = Math.floor(p5.random(-sizeOffsetRange, sizeOffsetRange));
    //   const size = averageSize + sizeOffset;
    //   difference += size - averageSize;
    //   gridAxis.push(size);
    // }
    // gridAxis[numberOfPieces - 1] = gridAxis[numberOfPieces - 1] - difference;
    const oneCol = 900 / gridCols;
    const colSpanCount = Math.floor(p5.random(1, axisPiecesMax));
    const maxInitialColSpanSize = Math.floor(gridCols / colSpanCount);
    const initialCols = [];
    let remainingCols = gridCols;

    for (let i = 0; i < colSpanCount; i++) {
      const colSpanSize = Math.floor(p5.random(1, maxInitialColSpanSize));
      remainingCols -= colSpanSize;
      initialCols.push(colSpanSize);
    }

    for (let i = 0; i < remainingCols; i++) {
      const randomCol = Math.floor(p5.random(0, initialCols.length));
      initialCols[randomCol]++;
    }

    const gridAxis = initialCols.map((col) => col * oneCol);

    return gridAxis;
  };

  const writeText = (
    xPos: number,
    yPos: number,
    width: number,
    height: number,
    color: P5.Color,
  ): void => {
    const offscreen = p5.createGraphics(width, height);
    let textSize, leading;

    if (height > width) {
      // vertical
      textSize = p5.map(height, size / rows.length, size, 50, 100);
      leading = p5.map(textSize, 100, 200, 80, 150);
    } else {
      // horizontal
      textSize = p5.map(width, 1, size / cols.length, 50, 100);
      leading = p5.map(textSize, 100, 200, 80, 150);
    }

    if (color === pallete[0] || color === pallete[2]) {
      offscreen.fill(pallete[p5.random() > 0.5 ? 1 : 3]);
    } else {
      offscreen.fill(pallete[p5.random() > 0.5 ? 2 : 0]);
    }

    const font = fonts[Math.floor(p5.random(0, fonts.length))];

    offscreen.noStroke();
    offscreen.textSize(textSize);
    offscreen.textLeading(leading);
    offscreen.textAlign(p5.RIGHT, p5.BOTTOM);
    offscreen.textWrap(p5.CHAR);
    offscreen.textFont(font);
    console.log(font);
    offscreen.text('PEACE', 0, 0, width + textSize * 0.03, height + textSize * 0.23);
    textDrawn = true;
    p5.blendMode(p5.BLEND);
    p5.image(offscreen, xPos, yPos);
  };

  const drawCollagePiece = (
    img: P5.Image,
    color: P5.Color,
    xPos: number,
    yPos: number,
    width: number,
    height: number,
  ) => {
    if (img) {
      const selectedImage = { ...images[Math.floor(p5.random(0, images.length))] } as P5.Image;
      const sxOff = p5.random(-imageSourceOffsetRange, imageSourceOffsetRange);
      const syOff = p5.random(-imageSourceOffsetRange, imageSourceOffsetRange);
      const sx = Math.floor(p5.random(0, selectedImage.width * 0.5 - width * 0.5)) + sxOff;
      const sy = Math.floor(p5.random(0, selectedImage.height * 0.5 - height * 0.5)) + syOff;
      const scale = p5.random(1, 2);

      const offscreen = p5.createGraphics(width, height);
      offscreen.image(selectedImage, 0, 0, width, height, sx, sy, width / scale, height / scale);
      offscreen.filter(p5.GRAY);

      p5.tint(color);
      p5.image(offscreen, xPos, yPos, width, height, 0, 0);
    } else {
      p5.noStroke();
      p5.fill(color);
      p5.rect(xPos, yPos, width, height);

      if (!textDrawn && p5.random() > textChance) {
        writeText(xPos, yPos, width, height, color);
      }
    }
  };

  p5.preload = function () {
    for (let i = 1; i <= imageCount; i++) {
      const img = p5.loadImage(`./computational-collagism/sunflower${i}.png`);
      images.push(img);
    }

    for (let i = 0; i < fontVariants.length; i++) {
      fonts.push(p5.loadFont(`./Inter-${fontVariants[i]}.ttf`));
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
    p5.background(bgPallete[Math.floor(p5.random(0, bgPallete.length))]);

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
        drawCollagePiece(img, color, xPos, yPos, cols[j], rows[i]);
        xPos += cols[j];
      }
      yPos += rows[i];
      xPos = 0;
    }
  };
};

export default function (): Artwork<SketchP5ArtworkFunction> {
  return {
    type: 'P5JS',
    artworkFunction: artwork,
  };
}
