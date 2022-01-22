import './index.css';
import { Artwork } from './types/artwork';
import SketchThree from './Sketch/threejs/Sketch';
import SketchP5 from './Sketch/p5js/Sketch';

(async function () {
  const art = await import(`./sketches/${process.env.SKETCHNAME}/${process.env.SKETCHNAME}`);
  const { type, artworkFunction } = art.default() as Artwork<any>;

  if (type === 'THREEJS') {
    new SketchThree(artworkFunction).start();
  } else if (type === 'P5JS') {
    new SketchP5(artworkFunction);
  }
})();
