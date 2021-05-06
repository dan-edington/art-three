import { SketchClass } from './types/sketch';
import Sketch from './Sketch/Sketch';
import defaultCube from './sketches/defaultCube/defaultCube';
//import deptLogo from './sketches/deptLogo/deptLogo';
import waterwheels from './sketches/waterwheels/waterwheels';
import './index.css';

const s: SketchClass = new Sketch(waterwheels);
s.start();
