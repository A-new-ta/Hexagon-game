'use strict'

// import { width } from './index.js';
// import { height } from './index.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

let width = canvas.width;
let height = canvas.height;

if (window.innerWidth < 800) {
  width = canvas.width = window.innerWidth - 20;
} else {
  width = canvas.width = 800;
}
if (window.innerHeight < 800) {
    height = canvas.height = window.innerHeight - 300;
} else {
  height = canvas.height = 800;
}
  
var size = width / 18; // наружный радиус 23
var boardOffset = {x: 300, y: 300};
export { width };
export { height };

export default class Hex {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  add(hex) {
    return new Hex(this.x + hex.x, this.y + hex.y, this.z + hex.z);
  }
  toPixels() {
    var axial = cubeToAxial(this);
    return axialToPixels(axial);
  }
  fromPixels(pixels) {
    var axial = pixelsToAxial(pixels);
    return axialToCube(axial);
  }
}



//
// Hex.prototype.toAxial = function() {
//   return cubeToAxial()
// }

function pixelsToAxial(pixels) {
  var axial = {};
  axial.q = (pixels.x * Math.sqrt(3)/3 - pixels.y / 3) / size;
  axial.r = pixels.y * 2/3 / size;
  let roundedAxial = axialRound(axial);
  return roundedAxial;
}

function cubeToAxial(cube) {
  return {q: cube.x, r: cube.z}
}

function axialToCube(axial) {
  return new Hex(axial.q, -axial.q - axial.r, axial.r);
}

function axialToPixels(axial) {
  var pixels = {};
  pixels.x = size * Math.sqrt(3) * (axial.q + axial.r/2);
  pixels.y = size * 3/2 * axial.r;
  return pixels;
}

function axialRound(axial) {
  var floatCube = axialToCube(axial);
  var roundedCube = cubeRound(floatCube);
  return cubeToAxial(roundedCube);
}

function cubeRound(floatedCube) {
  var rx = Math.round(floatedCube.x)
  var ry = Math.round(floatedCube.y)
  var rz = Math.round(floatedCube.z)

  var x_diff = Math.abs(rx - floatedCube.x)
  var y_diff = Math.abs(ry - floatedCube.y)
  var z_diff = Math.abs(rz - floatedCube.z)

  if(x_diff > y_diff && x_diff > z_diff) {
    rx = -ry-rz;
  } else if(y_diff > z_diff) {
    ry = -rx-rz;
  } else {
    rz = -rx-ry;
  }

  return new Hex(rx, ry, rz);
}




