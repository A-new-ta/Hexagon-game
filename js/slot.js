'use strict'
// рисование одиночного шестиугольника,к координатам добавляем картинку

import { hexHelperF } from './hexhelper.js';


let defaultImage = new Image();
defaultImage.src = "images/slot_hex.svg"

export default class Slot {
    constructor(hex, context) {
        this.hex = hex;
        this._context = context;
        this.hexHelper = hexHelperF();
    }
    draw() {
        this.recalc();
        let image_width = (this.hexHelper.size * 1.9) - 2;
        let pixels = this.hex.toPixels();
        let img = this.tile == undefined ? defaultImage : this.tile.image;
        pixels = this.hexHelper.addVector2(pixels, this.hexHelper.boardOffset);
        pixels = this.hexHelper.subVector2(pixels, this.hexHelper.vector2Size);
        this._context.drawImage(img, pixels.x, pixels.y, image_width, image_width);
    }
    recalc() {
        this.hexHelper = hexHelperF();
    }
}





