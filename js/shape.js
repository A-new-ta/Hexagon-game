'use strict'


import Tile from './tile.js';
import { hexHelper } from './hex-helper.js';
import Hex from './hex.js';
import _, { sample } from './underscore.js'
// import {width} from './game.js'


// var image_width = (hexHelper.size * 1.9) - 2;
// варианты возможных форм для фигурок

var image_width = (hexHelper.size * 1.9) - 2;
const possibleShapes = [
  {
    image: "images/tile_hex_2.svg",
    coords: [ [0,0,0] ],
  },
  {
    image: "images/tile_hex_3.svg",
    coords: [
      [-1,0,1],
      [0,0,0],
      [1,0,-1],
      [2,0,-2],
    ],
  },
  {
    image: "images/tile_hex_3.svg",
    coords: [
      [-1,1,0],
      [0,0,0],
      [1,-1,0],
      [2,-2,0],
    ],
  },
  {
    image: "images/tile_hex_3.svg",
    coords: [
      [0,-1,1],
      [0,0,0],
      [0,1,-1],
      [0,2,-2],
    ],
  },
  {
    image: "images/tile_hex_4.svg",
    coords: [
      [0,-1,1],
      [0,0,0],
      [0,1,-1],
      [1,-1,0],
    ],
  },
  {
    image: "images/tile_hex_4.svg",
    coords: [
      [0,-1,1],
      [0,0,0],
      [0,1,-1],
      [-1,1,0],
    ],
  },
  {
    image: "images/tile_hex_4.svg",
    coords: [
      [-1,1,0],
      [0,0,0],
      [1,-1,0],
      [0,1,-1],
    ],
  },
  {
    image: "images/tile_hex_4.svg",
    coords: [
      [-1,1,0],
      [0,0,0],
      [1,-1,0],
      [0,-1,1],
    ],
  },
  {
    image: "images/tile_hex_4.svg",
    coords: [
      [-1,0,1],
      [0,0,0],
      [1,0,-1],
      [-1,1,0],
    ],
  },
  {
    image: "images/tile_hex_4.svg",
    coords: [
      [-1,0,1],
      [0,0,0],
      [1,0,-1],
      [1,-1,0],
    ],
  },
  {
    image: "images/tile_hex_1.svg",
    coords: [
      [0,0,0],
      [-1,1,0],
      [-1,0,1],
      [0,-1,1],
    ],
  },
  {
    image: "images/tile_hex_1.svg",
    coords: [
      [0,0,0],
      [-1,1,0],
      [1,0,-1],
      [0,1,-1],
    ],
  },
]

export default class Shape {
  constructor(context) {
    this._context = context;
    // this.tiles = this.makeTilesFromCoords((possibleShapes));
    this.tiles = this.makeTilesFromCoords(_.sample(possibleShapes));

  }
  makeTilesFromCoords(shapeOpts) {
    var shape = this;
    this.image = shapeOpts.image;
    return shapeOpts.coords.map(function (coords) {
      var [x, y, z] = coords;
      return {
        hex: new Hex(x, y, z),
        tile: new Tile(shapeOpts.image)
      };
    });
  }


  draw(xOffset, yOffset, scale = 1) {
    var ctx = this._context;
    this.tiles.forEach(function (tileOpts) {
      // var [x,y] = hexHelper.hexToPixels(tileOpts.x, tileOpts.y, tileOpts.z).map(n => n * scale);
      let pixels = tileOpts.hex.toPixels();

      pixels.x = pixels.x * scale + xOffset - hexHelper.size;
      pixels.y = pixels.y * scale + yOffset - hexHelper.size;

      let img = tileOpts.tile.image;
      ctx.drawImage(img, pixels.x, pixels.y, image_width * scale, image_width * scale);
    });
  }
}


    


