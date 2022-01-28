import './index.css';
import SketchThree from './Sketch/threejs/Sketch';
import SketchP5 from './Sketch/p5js/Sketch';
import generateSeed from './Sketch/shared/generateSeed';

(async function () {
  const art = await import(`./sketches/${process.env.SKETCHNAME}/${process.env.SKETCHNAME}`);
  const { type, artworkFunction } = art.default();

  let seed = parseInt(new URLSearchParams(window.location.search).get('seed'), 10);

  if (isNaN(seed)) {
    seed = generateSeed();
  }

  console.log(`SEED: ${seed}`);

  if (type === 'THREEJS') {
    new SketchThree(artworkFunction, seed).start();
  } else if (type === 'P5JS') {
    new SketchP5(artworkFunction, seed);
  }
})();
