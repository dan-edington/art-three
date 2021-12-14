import './index.css';
import { SketchThreeClass } from './types/sketchThree';
import SketchThree from './Sketch/threejs/Sketch';

import art from './sketches/waterwheels/waterwheels';

const { type, artworkFunction } = art();

if (type === 'THREEJS') {
  const sketch: SketchThreeClass = new SketchThree(artworkFunction);
  sketch.start();
} else if (type === 'P5JS') {
  const sketch = new SketchThree(artworkFunction);
  sketch.start();
}
