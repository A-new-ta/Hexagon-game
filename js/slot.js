'use strict'

import { hexHelper } from './hex-helper.js';
// import {width} from './game.js'
// const hexHelper = require('./hex-helper');

var defaultImage = new Image();
defaultImage.src = "images/slot_hex.svg"



// const canvas = document.getElementById("game");
// const ctx = canvas.getContext('2d');
// canvas.width = 800;
// canvas.height = 600;
// let size = canvas.width / 22;
// let x = canvas.width / 22;
// let y = canvas.width / 22;
// ctx.beginPath();
// ctx.moveTo(x + size * Math.cos(0), y + size * Math.sin(0));

// for (let side; side < 7; side++) {
// ctx.lineTo(x + size * Math.cos(side * 2 * Math.PI / 6), y + size * Math.sin(side * 2 * Math.PI / 6));
// }
// ctx.fillStyle = "#fff";
// ctx.fill();


    
var image_width = (hexHelper.size * 1.9) - 2;

export default class Slot {
  constructor(hex, context) {
    this.hex = hex;
    this._context = context;
  }
  draw() {
    var pixels = this.hex.toPixels();
    let img = this.tile == undefined ? defaultImage : this.tile.image;
    pixels = hexHelper.addVector2(pixels, hexHelper.boardOffset);
    pixels = hexHelper.subVector2(pixels, hexHelper.vector2Size);
    this._context.drawImage(img, pixels.x, pixels.y, image_width, image_width);
  }
}


// module.exports = Slot;