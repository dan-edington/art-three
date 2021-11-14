import './index.css';
import { SketchClass } from './types/sketch';
import Sketch from './Sketch/Sketch';
import _sketch from './sketches/idk/idk';

const s: SketchClass = new Sketch(_sketch);
s.start();
