'use strict'

import Board from './board.js';
import Shape from './shape.js';
import { hexHelperF } from './hexhelper.js';
import _, { values } from './underscore.js'
import { finishSound, showGameOverWindow, soundFlag } from './main.js';
import { nameText } from './main.js';
import { saveRecords } from './ajax.js';


let canvas;
let ctx;
let width;
let height;
let firstHexX;
let firstHexY;
let secondHexX;
let secondHexY;
let thirdHexX;
let thirdHexY;
let proportion1;
let proportion2;
let board;
let mouseCoords;
let score;
let isMouseDown;
let shapeInHand;
let shapeFrom;
let shapesInWaiting;
let shapesInWaitingBoxes;


export function getCanvasSize() {
    canvas = document.getElementById("game");
    ctx = canvas.getContext('2d')
    width = canvas.width;
    height = canvas.height;
  
    let widthToHeight = 750 / 850;
    let newWidth = document.documentElement.clientWidth;
    let newHeight = document.documentElement.clientHeight;
    let newWidthToHeight = newWidth / newHeight;
    if (newWidthToHeight < 1) {
        canvas.setAttribute('style', 'margin-top:100px');
    } else {
        canvas.setAttribute('style', 'margin-top:0px');
    }
    if (newWidthToHeight > widthToHeight) {
        newWidth = newHeight * widthToHeight;
        height = canvas.height = newHeight;
        width = canvas.width = newWidth;
    } else {
        newHeight = newWidth / widthToHeight;
        width = canvas.width = newWidth;
        height = canvas.height = newHeight;
    }
      
    // пропорции положения боковых фигур относительно размера канваса
    firstHexX = width * 0.25; 
    firstHexY = height * 0.9 
    secondHexX = width * 0.5; 
    secondHexY = height * 0.9; 
    thirdHexX = width * 0.75; 
    thirdHexY = height * 0.9; 
    proportion1 = width * 0.05 
    proportion2 = width * 0.1 
    score = 0;
    isMouseDown = false;
    board = new Board(ctx);
    shapeInHand = false;
    shapeFrom = "zero";
    mouseCoords = {};
    shapesInWaiting = {
        first: new Shape(ctx),
        second: new Shape(ctx),
        third: new Shape(ctx)
    }
      
    shapesInWaitingBoxes = [
        {key: "first", bounds: [firstHexX - proportion2, firstHexX + proportion1, firstHexY - proportion2, firstHexY + proportion1]}, //600, 700, 100, 200
        {key: "second", bounds: [secondHexX - proportion2, secondHexX + proportion1, secondHexY - proportion2, secondHexY + proportion1]}, //600, 700, 250, 350
        {key: "third", bounds: [thirdHexX - proportion2, thirdHexX + proportion1, thirdHexY - proportion2, thirdHexY + proportion1]}, //600, 700, 400, 500
    ]
}



function drawShapesInWaiting() {
    shapesInWaiting.first.draw(firstHexX, firstHexY, .5); // координаты и размер для ожидающих фигур 650,150
    shapesInWaiting.second.draw(secondHexX, secondHexY, .5); // 700, 300
    shapesInWaiting.third.draw(thirdHexX, thirdHexY, .5); // 650, 450
}

// увеличение фигур при нажатии мышью или тачем
function drawShapeInHand(){
    if(isMouseDown && shapeInHand) {
      shapeInHand.drawScale(mouseCoords.x, mouseCoords.y);
    }
}


// проверяем какая фигура взята
function whichShapeDidYouPick() {
    return shapesInWaitingBoxes.reduce(function(shape, box) {
        let bounds = box.bounds;
        if(mouseCoords.x > bounds[0] && mouseCoords.x < bounds[1] && mouseCoords.y > bounds[2] && mouseCoords.y < bounds[3]){
            shape = shapesInWaiting[box.key];
            shapeFrom = box.key;
        }
        return shape;
    }, false)
}


export function start (){
  requestAnimationFrame(function gameLoop() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      board.draw();
      board.drawPotentialSlots(mouseCoords, shapeInHand);
      drawShapesInWaiting();
      drawShapeInHand();
      requestAnimationFrame(gameLoop);
  });
}


export function addGameListeners() {
    document.addEventListener('mousedown', mousedown);
    document.addEventListener('touchstart', touchstart);
    document.addEventListener('mouseup', mouseAndTouchEnd);
    document.addEventListener('touchend', mouseAndTouchEnd);
    document.addEventListener('mousemove', mousemove);
    document.addEventListener('touchmove', touchmove);
    window.addEventListener('resize', resize);
}

export function deleteGameListeners() {
    document.removeEventListener('mousedown', mousedown);
    document.removeEventListener('touchstart', touchstart);
    document.removeEventListener('mouseup', mouseAndTouchEnd);
    document.removeEventListener('touchend', mouseAndTouchEnd);
    document.removeEventListener('mousemove', mousemove);
    document.removeEventListener('touchmove', touchmove);
    window.removeEventListener('resize', resize);
}

function mousedown (eo) {
    mouseCoords = getMousePos(canvas, eo);
    // console.log(mouseCoords);
    isMouseDown = true;
    shapeInHand = whichShapeDidYouPick();
}

function touchstart(eo) {
    mouseCoords = getTouchPos(canvas, eo);
    isMouseDown = true;
    shapeInHand = whichShapeDidYouPick();
}

function mousemove(eo) {
    if(isMouseDown){
      mouseCoords = getMousePos(canvas, eo);
    }
}

function touchmove (eo) {
    if (isMouseDown) {
      mouseCoords = getTouchPos(canvas, eo);
    }
}

function mouseAndTouchEnd(eo) {
    let helper = hexHelperF();
    let pixels = helper.subVector2(mouseCoords, helper.boardOffset);
    if(shapeInHand && board.validDrop(pixels, shapeInHand)){
        board.addTilesFromShape(pixels, shapeInHand);
        shapesInWaiting[shapeFrom] = new Shape(ctx);
        score += board.removeFullLines();
        document.getElementById("score-value").innerText = score;
        
        if (!board.movesRemaining(_.values(shapesInWaiting))) {
          if (soundFlag) finishSound();
          saveRecords();
          showGameOverWindow();
        }
    }
    isMouseDown = false;
    shapeInHand = false;
}

function getMousePos(canvas, eo) {
    let rect = canvas.getBoundingClientRect();
    return {
        x: eo.clientX - rect.left,
        y: eo.clientY - rect.top
    };
}

// по Y меньше чтобы при таче была видна фигура(нажимать чуть ниже)
function getTouchPos(canvas, eo) {
    let rect = canvas.getBoundingClientRect();
    return {
        x: eo.touches[0].clientX - rect.left,
        y: eo.touches[0].clientY - rect.top - 50,
    };
}


// responsive canvas
export function resize() {
    
    let widthToHeight = 750 / 850;
    let newWidth = document.documentElement.clientWidth;
    let newHeight = document.documentElement.clientHeight;
    let newWidthToHeight = newWidth / newHeight;
    if (newWidthToHeight < 1) {
        canvas.setAttribute('style', 'margin-top:100px');
    } else {
        canvas.setAttribute('style', 'margin-top:0px');
    }
    if (newWidthToHeight > widthToHeight) {
        newWidth = newHeight * widthToHeight;
        height = canvas.height = newHeight;
        width = canvas.width = newWidth;
    } else {
        newHeight = newWidth / widthToHeight;
        width = canvas.width = newWidth;
        height = canvas.height = newHeight;
    }
    
//пропорции положения боковых фигур относительно размера канваса
    firstHexX = width * 0.25; //0.76
    firstHexY = height * 0.9 //0.18
    secondHexX = width * 0.5; //0.82
    secondHexY = height * 0.9; //0.35
    thirdHexX = width * 0.75; // 0.76
    thirdHexY = height * 0.9; //0.53
    proportion1 = width * 0.05 // 
    proportion2 = width * 0.1 // 
    score = 0;
    isMouseDown = false;
    shapeInHand = false;
    shapeFrom = "zero";
    mouseCoords = {};
          
    shapesInWaitingBoxes = [
        {key: "first", bounds: [firstHexX - proportion2, firstHexX + proportion1, firstHexY - proportion2, firstHexY + proportion1]}, //600, 700, 100, 200
        {key: "second", bounds: [secondHexX - proportion2, secondHexX + proportion1, secondHexY - proportion2, secondHexY + proportion1]}, //600, 700, 250, 350
        {key: "third", bounds: [thirdHexX - proportion2, thirdHexX + proportion1, thirdHexY - proportion2, thirdHexY + proportion1]}, //600, 700, 400, 500
    ]
  
    board.draw();
    board.drawPotentialSlots(mouseCoords, shapeInHand);
    drawShapesInWaiting();
    drawShapeInHand();   
}


export { width };
export { height };
export { score };