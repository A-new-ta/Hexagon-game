'use strict'

import { hexHelper } from './hex-helper.js';
// import {width} from './game.js'


var defaultImage = new Image();
defaultImage.src = "images/slot_hex.svg"



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


