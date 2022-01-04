import './index.css';
import { Artwork } from './types/artwork';
import SketchThree from './Sketch/threejs/Sketch';
import SketchP5 from './Sketch/p5js/Sketch';

import art from './sketches/genuary-4/genuary-4';

const { type, artworkFunction } = art() as Artwork<any>;

if (type === 'THREEJS') {
  const sketch = new SketchThree(artworkFunction);
  sketch.start();
} else if (type === 'P5JS') {
  const sketch = new SketchP5(artworkFunction);
}
