# Sketch

This is a small framework for writing creative code. I should change the name to something that isn't Sketch.

It comes in two flavours: P5.js or Three.js.

## Getting Started

To create a new sketch:

```
npm run new
```

To run a sketch:

```
npm run start --sketch=nameGoesHere
```

## Seed

A new seed is generated on each page load and logged to the console. To use a custom seed, pass it as a query parameter (`?seed=123`).
All noise and RNG functions should use this seed.
For three.js sketches, the seed can be accessed with `this.seed`.
For P5.js sketches, the seed is passed into the artwork function as an argument called `seed`.

## P5.js

Simple wrapper for P5.js.

## Three.js

Sets up a renderer, scene, camera and clock (available on `this`).

### Options

An optional options object can be added to the object returned from the artwork function:

useOrbit: boolean;

showStats: boolean;

noAnimation: boolean;

disableAutoRender: boolean;

disableAA: boolean;

dimensions: {
width: number;
height: number;
}
