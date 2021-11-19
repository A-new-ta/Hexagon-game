'use strict'

import * as Game from './game.js';


export default class Tile {
  constructor(image, context) {
    this.image = new Image();
    this.image.src = image;

    this._context = context;
    
  }

}



 