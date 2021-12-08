'use strict'

import Hex from './hex.js';
import { width } from './game.js'
import { height } from './game.js'


export function hexHelperF() {
    let hexHelper;
    return hexHelper = {
      
        size: width / 18,
        vector2Size: { x: width / 18, y: width / 18 }, //40 35//23 23
        boardOffset: { x: width / 2.0, y: height / 2.5 }, //300 300//2.1 2.4
      
        cubeToAxial: function(x, y, z) {
          return [x, z]
        },
      
        axialToCube: function(q, r) {
          return [q, -q - r, r]
        },
        
        axialToPixels: function(q, r) {
            let x = this.size * Math.sqrt(3) * (q + r / 2)
            let y = this.size * 3 / 2 * r
            return [x, y]
        },
        
        hexToPixels: function(x, y, z) {
            [q, r] = this.cubeToAxial(x, y, z);
            return this.axialToPixels(q, r);
        },
        
        pixelsToAxial: function(x, y) {
            q = (x * Math.sqrt(3) / 3 - y / 3) / this.size;
            r = y * 2 / 3 / this.size;
            [rq, rr] = this.axialRound(q, r);
            return [rq, rr];
        },
        
        pixelsToHex: function(x, y) {
            let [q, r] = this.pixelsToAxial(x, y);
            return this.axialToCube(q, r)
            // let [fx, fy, fz] = this.axialToCube(q, r);
            // return this.cubeRound(fx, fy, fz);
        },
        
        axialRound: function(q, r) {
            let [fx, fy, fz] = this.axialToCube(q, r);
            let [x, y, z] = this.cubeRound(fx, fy, fz);
            return this.cubeToAxial(x, y, z);
        },
        
        cubeRound: function(x, y, z) {
            let rx = Math.round(x)
            let ry = Math.round(y)
            let rz = Math.round(z)
      
            let x_diff = Math.abs(rx - x)
            let y_diff = Math.abs(ry - y)
            let z_diff = Math.abs(rz - z)
      
            if (x_diff > y_diff && x_diff > z_diff) {
                rx = -ry - rz;
            } else if (y_diff > z_diff) {
                ry = -rx - rz;
            } else {
                rz = -rx - ry;
            }
        
            return [rx, ry, rz];
        },
        
        nearestHexCenterFromPixels: function(pixels) {
            let hex = (new Hex()).fromPixels(pixels);
            return hex.toPixels();
        },
        
        addVector2: function(a, b) {
            return {
                x: a.x + b.x,
                y: a.y + b.y
            };
        },
        
        subVector2: function(a, b) {
          return {
            x: a.x - b.x,
            y: a.y - b.y
          };
      }
      
    }
}


