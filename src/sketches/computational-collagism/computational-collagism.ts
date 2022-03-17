import P5 from 'p5';
import { Artwork } from '../../types/artwork';
import { SketchP5ArtworkFunction } from '../../types/sketchP5';

/*
SEEDS:
174616579851
24876316212
903006744114
798710989898
896894337073
719219509155
839051658578
848984868122
267024133558
1528171703215
283149400207
*/

const artwork = (seed: number) => (p5: P5): void => {
  const pallete = [p5.color('#255AB5'), p5.color('#F7D648'), p5.color('#dfdfdf')];

  const tintPallete = [pallete[0], pallete[1]];

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

  const imageCount = 10;
  const images: Array<P5.Image> = [];
  let rows: Array<number>, cols: Array<number>;

  let textDrawn = false;
  const size = 900;
  const blankChance = 0.8;
  const textChance = 0.75;
  const axisPiecesMax = 6;
  const gridCols = 12;
  const imageSourceOffsetRange = 100;

  const generateGridAxis = (): Array<number> => {
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

    const possiblePallete = pallete.filter((c) => c != color);

    const font = fonts[Math.floor(p5.random(0, fonts.length))];

    offscreen.noStroke();
    offscreen.fill(p5.color(p5.random(possiblePallete)));
    offscreen.textSize(textSize);
    offscreen.textLeading(leading);
    offscreen.textAlign(p5.RIGHT, p5.BOTTOM);
    offscreen.textWrap(p5.CHAR);
    offscreen.textFont(font);
    offscreen.text('PEACE', 0, 0, width + textSize * 0.03, height + textSize * 0.23);
    p5.blendMode(p5.BLEND);
    p5.image(offscreen, xPos, yPos);
    textDrawn = true;
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

      p5.noStroke();
      p5.fill(color);
      p5.rect(xPos, yPos, width, height);
      p5.tint(color);
      p5.image(offscreen, xPos, yPos, width, height, 0, 0);
      p5.tint(255);
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
    let xPos = 0;
    let yPos = 0;

    for (let i = 0; i < rows.length; i++) {
      for (let j = 0; j < cols.length; j++) {
        const img = p5.random() > blankChance ? images[Math.floor(p5.random(images.length))] : null;
        let color;
        if (img) {
          color = tintPallete[Math.floor(p5.random(tintPallete.length))];
        } else {
          color = tintPallete[Math.floor(p5.random(tintPallete.length))];
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
