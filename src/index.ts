import './index.css';
import { SketchClass } from './types/sketch';
import Sketch from './Sketch/Sketch';
import _sketch from './sketches/doneit/doneit';

const s: SketchClass = new Sketch(_sketch);
s.start();
