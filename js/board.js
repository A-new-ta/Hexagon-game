'use strict'

import Slot from './slot.js';
import Tile from './tile.js';
import Hex from './hex.js';
import _, { every } from './underscore.js'
import { hexHelperF } from './hexhelper.js';
import { clickSound } from './index.js';
import { soundFlag } from './index.js';

export default class Board {
    constructor(context) {
        this.boardSize = 4;
        this.slots = [];
        this.hexHelper = hexHelperF();
        for (let x = -this.boardSize; x <= this.boardSize; x++) {
            for (let y = -this.boardSize; y <= this.boardSize; y++) {
                for (let z = -this.boardSize; z <= this.boardSize; z++) {
                    if (x + y + z == 0) {
                    let slot = new Slot(new Hex(x, y, z), context);
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
        if (!shape)
        return;
        let hexHelper = hexHelperF();
        let pixels = hexHelper.subVector2(mouseCoords, hexHelper.boardOffset);
        if (!this.validDrop(pixels, shape))
        return;

        let center = hexHelper.nearestHexCenterFromPixels(pixels);
        center = hexHelper.addVector2(center, hexHelper.boardOffset);
        shape.draw(center.x, center.y);
    }
  
    validDrop(pixels, shape) {
      if (!shape)
        return;

      let hex = (new Hex()).fromPixels(pixels);
      return this.validShapeAtCoords(hex, shape);
    }
  
    coordsToSlot(x, y, z) {
        let matchCoords = [x, y, z];
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

        let hex = (new Hex()).fromPixels(pixels);
        let board = this;
        shape.tiles.forEach(function (tileOpts) {
            let tile = new Tile(shape.image);
            board.hexToSlot(hex.add(tileOpts.hex)).tile = tile;
        });
    }
  
    removeFullLines() {
            
        let board = this;
        let fullRows = ['x', 'y', 'z'].reduce(function (allRows, axis) {
            for (let n = -board.boardSize; n <= board.boardSize; n++) {
                allRows.push(board.getRow(axis, n));
            }
                return allRows;
        }, []).filter(function (row) {
            return _.every(row, function (slot) {
            return slot.tile != undefined;
            });
        });

        let multiplier = 1;
        let score = 0;
        fullRows.forEach(function (fullRow) {
            fullRow.forEach(function (slot) {
                slot.tile = undefined;
            });
            score += fullRow.length * 500 * multiplier;
            multiplier++;
            if (soundFlag) clickSound();
            if (navigator.vibrate) {
                window.navigator.vibrate(200);
            }
        });

        return score;
    }
  
    validShapeAtCoords(hex, shape) {
        if (!shape)
            return;
        
        let hexesToCheck = shape.tiles.map(function (tile) {
            return hex.add(tile.hex);
        });
        
        let board = this;
        return _.every(hexesToCheck, function (hex) {
            let slot = board.hexToSlot(hex);
            return slot && slot.tile == undefined;
        });
        
    }
  
    hexToSlot(hex) {
        let board = this;
        return board.coordsToSlot(hex.x, hex.y, hex.z);
    }

    getRow(axis, rowNumber) {
        return this.slots.filter(function (slot) {
            return slot.hex[axis] == rowNumber;
        });
    }
  
    movesRemaining(shapes) {
        let board = this;
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













