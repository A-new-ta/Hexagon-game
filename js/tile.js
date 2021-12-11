'use strict'
// выбор картинки из библиотеки
export default class Tile {
    constructor(image, context) {
        this.image = new Image();
        this.image.src = image;
        this._context = context;
    }
}





 