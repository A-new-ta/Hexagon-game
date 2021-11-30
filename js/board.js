'use strict'

import Slot from './slot.js';
import Tile from './tile.js';
import Hex from './hex.js';
import _, { every } from './underscore.js'
import { hexHelperF } from './hexhelper.js';
import { clickSound } from './index.js';


export default class Board {
  constructor(context) {
    this.boardSize = 4;
    this.slots = [];
    this.hexHelper = hexHelperF();
    for (var x = -this.boardSize; x <= this.boardSize; x++) {
      for (var y = -this.boardSize; y <= this.boardSize; y++) {
        for (var z = -this.boardSize; z <= this.boardSize; z++) {
          if (x + y + z == 0) {
            var slot = new Slot(new Hex(x, y, z), context);
            this.slots.push(slot);
          }
        }
      }
    }
  }
  
  addRandomTiles() {
    this.slots.forEach(function (slot) {
      if (Math.random() > .8)
        slot.tile = new Tile("../images/tile_hex_1.svg");
    });
  }
  drawPotentialSlots(mouseCoords, shape) {
    // console.log(shape);
    if (!shape)
      return;
    let hexHelper = this.hexHelper;
    let pixels = hexHelper.subVector2(mouseCoords, hexHelper.boardOffset);
    // console.log(hexHelper);
    if (!this.validDrop(pixels, shape))
      // console.log(pixels);
      // console.log(shape);
      return;

    var center = hexHelper.nearestHexCenterFromPixels(pixels);
    
    // console.log(hexHelper);
    // console.log(center);
    // console.log(pixels);

    center = hexHelper.addVector2(center, hexHelper.boardOffset);
    
    shape.draw(center.x, center.y);
  }
  validDrop(pixels, shape) {
    if (!shape)
      return;

    var hex = (new Hex()).fromPixels(pixels);
    // console.log(hex);
    // console.log(shape);
    // console.log(this);
    return this.validShapeAtCoords(hex, shape);
  }
  coordsToSlot(x, y, z) {
    var matchCoords = [x, y, z];
    // console.log(matchCoords);
    // console.log(this);
    // console.log(this.slots);
    return this.slots.reduce(function (slot, slotToCheck) {
      let currentCoords = [slotToCheck.hex.x, slotToCheck.hex.y, slotToCheck.hex.z];
      return _.isEqual(matchCoords, currentCoords) ? slotToCheck : slot;
    }, false);
  }
  addTilesFromShape(pixels, shape) {
    if (!shape)
      return;
    if (!this.validDrop(pixels, shape))
      return;

    var hex = (new Hex()).fromPixels(pixels);
    var board = this;
    shape.tiles.forEach(function (tileOpts) {
      var tile = new Tile(shape.image);
      board.hexToSlot(hex.add(tileOpts.hex)).tile = tile;
    });
  }
  removeFullLines() {
    //get full rows
    // let gameSound = new Audio('sound/sound.mp3');
    var board = this;
    var fullRows = ["x", "y", "z"].reduce(function (allRows, axis) {
      for (var n = -board.boardSize; n <= board.boardSize; n++) {
        allRows.push(board.getRow(axis, n));
      }
      return allRows;
    }, []).filter(function (row) {
      return _.every(row, function (slot) {
        return slot.tile != undefined;
      });
    });

    var multiplier = 1;
    var score = 0;
    fullRows.forEach(function (fullRow) {
      fullRow.forEach(function (slot) {
        slot.tile = undefined;
      });
      score += fullRow.length * 500 * multiplier;
      multiplier++;
      // gameSound.play();
      clickSound();
      if (navigator.vibrate) {
        window.navigator.vibrate(100);
      }
    });

    return score;
  }
  validShapeAtCoords(hex, shape) {
    if (!shape)
      return;
    // console.log(shape);
    var hexesToCheck = shape.tiles.map(function (tile) {
      return hex.add(tile.hex);
    });
    // console.log(hexesToCheck);

    var board = this;
    return _.every(hexesToCheck, function (hex) {
      let slot = board.hexToSlot(hex);
      // console.log(slot);
      return slot && slot.tile == undefined;
    });
    
  }
  hexToSlot(hex) {
    var board = this;
    // console.log(hex.x, hex.y, hex.z);
    return board.coordsToSlot(hex.x, hex.y, hex.z);
  }

  getRow(axis, rowNumber) {
    return this.slots.filter(function (slot) {
      return slot.hex[axis] == rowNumber;
    });
  }
  movesRemaining(shapes) {
    var board = this;
    return _.any(this.slots, function (slot) {
      return _.any(shapes, function (shape) {
        return board.validShapeAtCoords(slot.hex, shape);
      });
    });
  }
  draw() {
    this.slots.forEach(function (slot) {
      slot.draw();
    });
  }

}













