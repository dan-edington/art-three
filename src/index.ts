import Sketch from './Sketch/Sketch';
//import defaultCube from './sketches/defaultCube/defaultCube';
import deptLogo from './sketches/deptLogo/deptLogo';
import './index.css';

const s: Sketch = new Sketch(deptLogo);
s.start();