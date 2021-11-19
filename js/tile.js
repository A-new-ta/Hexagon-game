'use strict'

import * as Game from './game.js';


export default class Tile {
  constructor(image, context) {
    this.image = new Image();
    this.image.src = image;

    this._context = context;
    // let size = canvas.width / 22;
    // let x = canvas.width / 22;
    // let y = canvas.width / 22;
    // canvas.beginPath();
    // canvas.moveTo(x + size * Math.cos(0), y + size * Math.sin(0));

    // for (side; side < 7; side++) {
    // canvas.lineTo(x + size * Math.cos(side * 2 * Math.PI / 6), y + size * Math.sin(side * 2 * Math.PI / 6));
    // }

    // canvas.fillStyle = "#333333";
    // canvas.fill();
  }

}



  // module.exports = Tile;