'use strict'

import { width } from './game.js';
import { height } from './game.js';

// получаем координаты  шестиугольников
export default class Hex {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    add(hex) {
        return new Hex(this.x + hex.x, this.y + hex.y, this.z + hex.z);
    }
    toPixels() {
        let axial = cubeToAxial(this);
        return axialToPixels(axial);
    }
    fromPixels(pixels) {
        let axial = pixelsToAxial(pixels);
        return axialToCube(axial);
    }
}


function pixelsToAxial(pixels) {
    let axial = {};
    axial.q = (pixels.x * Math.sqrt(3)/3 - pixels.y / 3) / (width / 18);
    axial.r = pixels.y * 2/3 / (width / 18);
    let roundedAxial = axialRound(axial);
    return roundedAxial;
}

function cubeToAxial(cube) {
    return {q: cube.x, r: cube.z}
}

function axialToCube(axial) {
    return new Hex(axial.q, -axial.q - axial.r, axial.r);
}

function axialToPixels(axial) {
    let pixels = {};
    pixels.x = (width / 18) * Math.sqrt(3) * (axial.q + axial.r/2);
    pixels.y = (width / 18) * 3/2 * axial.r;
    return pixels;
}

function axialRound(axial) {
    let floatCube = axialToCube(axial);
    let roundedCube = cubeRound(floatCube);
    return cubeToAxial(roundedCube);
}

function cubeRound(floatedCube) {
    let rx = Math.round(floatedCube.x)
    let ry = Math.round(floatedCube.y)
    let rz = Math.round(floatedCube.z)

    let x_diff = Math.abs(rx - floatedCube.x)
    let y_diff = Math.abs(ry - floatedCube.y)
    let z_diff = Math.abs(rz - floatedCube.z)

    if(x_diff > y_diff && x_diff > z_diff) {
        rx = - ry - rz;
    } else if(y_diff > z_diff) {
        ry = - rx - rz;
    } else {
        rz = - rx - ry;
    }

    return new Hex(rx, ry, rz);
}






